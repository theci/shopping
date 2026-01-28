package com.ecommerce.order.application;

import com.ecommerce.cart.domain.Cart;
import com.ecommerce.cart.domain.CartItem;
import com.ecommerce.cart.domain.CartRepository;
import com.ecommerce.cart.exception.CartNotFoundException;
import com.ecommerce.customer.domain.Customer;
import com.ecommerce.customer.domain.CustomerRepository;
import com.ecommerce.order.domain.Order;
import com.ecommerce.order.domain.OrderRepository;
import com.ecommerce.order.domain.OrderStatus;
import com.ecommerce.order.dto.*;
import com.ecommerce.order.exception.OrderNotFoundException;
import com.ecommerce.product.domain.Product;
import com.ecommerce.product.domain.ProductRepository;
import com.ecommerce.product.exception.InsufficientStockException;
import com.ecommerce.product.exception.ProductNotFoundException;
import com.ecommerce.shared.dto.PageResponse;
import com.ecommerce.shared.infrastructure.DomainEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;


/**
 * Order Service
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final OrderMapper orderMapper;
    private final DomainEventPublisher domainEventPublisher;

    /**
     * 장바구니에서 주문 생성
     */
    @Transactional
    public OrderResponse createOrder(Long customerId, OrderCreateRequest request) {
        // 1. 장바구니 조회
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new CartNotFoundException(customerId));

        if (cart.isEmpty()) {
            throw new IllegalStateException("장바구니가 비어있습니다.");
        }

        // 2. 주문 생성
        Order order = Order.builder()
                .customerId(customerId)
                .recipientName(request.getRecipientName())
                .recipientPhone(request.getRecipientPhone())
                .shippingPostalCode(request.getShippingPostalCode())
                .shippingAddress(request.getShippingAddress())
                .shippingAddressDetail(request.getShippingAddressDetail())
                .shippingMemo(request.getShippingMemo())
                .build();

        // 3. 장바구니 아이템 → 주문 아이템 변환 (재고 확인)
        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException(cartItem.getProductId()));

            // 재고 확인
            if (!product.hasStock(cartItem.getQuantity())) {
                throw new InsufficientStockException(
                        product.getId(), product.getStockQuantity(), cartItem.getQuantity());
            }

            // 주문 아이템 추가
            order.addItem(
                    product.getId(),
                    product.getName(),
                    cartItem.getProductImageUrl(),
                    cartItem.getQuantity(),
                    product.getPrice()  // 주문 시점의 가격 사용
            );
        }

        // 4. 주문 저장
        Order savedOrder = orderRepository.save(order);

        // 5. 주문 생성 이벤트 발행
        savedOrder.place();
        domainEventPublisher.publishEvents(savedOrder);

        // 6. 장바구니 비우기
        cart.clear();
        cartRepository.save(cart);

        log.info("주문 생성: orderId={}, orderNumber={}, customerId={}",
                savedOrder.getId(), savedOrder.getOrderNumber(), customerId);

        return orderMapper.toResponse(savedOrder);
    }

    /**
     * 주문 상세 조회
     */
    public OrderResponse getOrder(Long customerId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        // 본인 주문만 조회 가능
        if (!order.getCustomerId().equals(customerId)) {
            throw new OrderNotFoundException(orderId);
        }

        return orderMapper.toResponse(order);
    }

    /**
     * 내 주문 목록 조회
     */
    public PageResponse<OrderResponse> getMyOrders(Long customerId, OrderSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());

        Page<Order> orderPage;
        if (request.getStatus() != null) {
            orderPage = orderRepository.findByCustomerIdAndOrderStatus(
                    customerId, request.getStatus(), pageable);
        } else {
            orderPage = orderRepository.findByCustomerId(customerId, pageable);
        }

        Page<OrderResponse> responsePage = orderPage.map(orderMapper::toResponse);
        return PageResponse.of(responsePage);
    }

    /**
     * 주문 확인 (결제 완료 후 호출)
     */
    @Transactional
    public OrderResponse confirmOrder(Long orderId, Long paymentId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        // 재고 차감
        for (var item : order.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException(item.getProductId()));
            product.decreaseStock(item.getQuantity());
            productRepository.save(product);
        }

        // 주문 확인 처리
        order.confirm(paymentId);

        Order savedOrder = orderRepository.save(order);
        domainEventPublisher.publishEvents(savedOrder);

        log.info("주문 확인: orderId={}, paymentId={}", orderId, paymentId);

        return orderMapper.toResponse(savedOrder);
    }

    /**
     * 주문 취소
     */
    @Transactional
    public OrderResponse cancelOrder(Long customerId, Long orderId, OrderCancelRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        // 본인 주문만 취소 가능
        if (!order.getCustomerId().equals(customerId)) {
            throw new OrderNotFoundException(orderId);
        }

        // 이미 결제 완료된 주문이면 재고 복구
        if (order.getOrderStatus() == OrderStatus.CONFIRMED ||
            order.getOrderStatus() == OrderStatus.PREPARING) {
            for (var item : order.getItems()) {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new ProductNotFoundException(item.getProductId()));
                product.increaseStock(item.getQuantity());
                productRepository.save(product);
            }
        }

        // 주문 취소
        order.cancel(request.getReason());

        Order savedOrder = orderRepository.save(order);
        domainEventPublisher.publishEvents(savedOrder);

        log.info("주문 취소: orderId={}, reason={}", orderId, request.getReason());

        return orderMapper.toResponse(savedOrder);
    }

    /**
     * 구매 확정
     */
    @Transactional
    public OrderResponse completeOrder(Long customerId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        // 본인 주문만 구매 확정 가능
        if (!order.getCustomerId().equals(customerId)) {
            throw new OrderNotFoundException(orderId);
        }

        order.complete();

        Order savedOrder = orderRepository.save(order);
        domainEventPublisher.publishEvents(savedOrder);

        log.info("구매 확정: orderId={}", orderId);

        return orderMapper.toResponse(savedOrder);
    }

    // ========== Admin 전용 메서드 ==========

    /**
     * 전체 주문 목록 조회 (Admin)
     */
    public PageResponse<AdminOrderListResponse> getAllOrders(AdminOrderSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());

        Page<Order> orderPage;
        if (request.getKeyword() != null || request.getStatus() != null ||
            request.getStartDate() != null || request.getEndDate() != null) {
            orderPage = orderRepository.searchOrders(
                    request.getKeyword(),
                    request.getStatus(),
                    request.getStartDate() != null ? request.getStartDate().atStartOfDay() : null,
                    request.getEndDate() != null ? request.getEndDate().atTime(LocalTime.MAX) : null,
                    pageable);
        } else {
            orderPage = orderRepository.findAll(pageable);
        }

        Page<AdminOrderListResponse> responsePage = orderPage.map(order -> {
            Customer customer = customerRepository.findById(order.getCustomerId()).orElse(null);
            return orderMapper.toAdminListResponse(order, customer);
        });

        return PageResponse.of(responsePage);
    }

    /**
     * 주문 상세 조회 (Admin)
     */
    public AdminOrderResponse getOrderForAdmin(Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        Customer customer = customerRepository.findById(order.getCustomerId()).orElse(null);
        return orderMapper.toAdminResponse(order, customer);
    }

    /**
     * 주문 상태 변경 (Admin)
     */
    @Transactional
    public AdminOrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        // 취소 처리 시 재고 복구
        if (request.getStatus() == OrderStatus.CANCELLED &&
            (order.getOrderStatus() == OrderStatus.CONFIRMED || order.getOrderStatus() == OrderStatus.PREPARING)) {
            for (var item : order.getItems()) {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new ProductNotFoundException(item.getProductId()));
                product.increaseStock(item.getQuantity());
                productRepository.save(product);
            }
        }

        order.updateStatusByAdmin(request.getStatus());

        if (request.getStatus() == OrderStatus.CANCELLED && request.getReason() != null) {
            order.cancel(request.getReason());
        }

        Order savedOrder = orderRepository.save(order);
        log.info("Admin 주문 상태 변경: orderId={}, newStatus={}", orderId, request.getStatus());

        Customer customer = customerRepository.findById(order.getCustomerId()).orElse(null);
        return orderMapper.toAdminResponse(savedOrder, customer);
    }

    /**
     * 배송 정보 업데이트 (Admin)
     */
    @Transactional
    public AdminOrderResponse updateShipping(Long orderId, ShippingUpdateRequest request) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        order.updateShippingInfo(request.getTrackingNumber(), request.getTrackingCompany());

        Order savedOrder = orderRepository.save(order);
        log.info("Admin 배송 정보 업데이트: orderId={}, trackingNumber={}", orderId, request.getTrackingNumber());

        Customer customer = customerRepository.findById(order.getCustomerId()).orElse(null);
        return orderMapper.toAdminResponse(savedOrder, customer);
    }

    /**
     * 관리자 메모 업데이트 (Admin)
     */
    @Transactional
    public AdminOrderResponse updateAdminMemo(Long orderId, AdminMemoRequest request) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        order.updateAdminMemo(request.getMemo());

        Order savedOrder = orderRepository.save(order);
        log.info("Admin 메모 업데이트: orderId={}", orderId);

        Customer customer = customerRepository.findById(order.getCustomerId()).orElse(null);
        return orderMapper.toAdminResponse(savedOrder, customer);
    }
}

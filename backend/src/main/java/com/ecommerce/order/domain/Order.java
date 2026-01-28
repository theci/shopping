package com.ecommerce.order.domain;

import com.ecommerce.order.domain.event.OrderCancelledEvent;
import com.ecommerce.order.domain.event.OrderCompletedEvent;
import com.ecommerce.order.domain.event.OrderConfirmedEvent;
import com.ecommerce.order.domain.event.OrderPlacedEvent;
import com.ecommerce.shared.domain.AggregateRoot;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 주문 Aggregate Root
 */
@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_order_customer", columnList = "customerId"),
    @Index(name = "idx_order_status", columnList = "orderStatus"),
    @Index(name = "idx_order_number", columnList = "orderNumber", unique = true)
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order extends AggregateRoot {

    @Column(nullable = false, unique = true, length = 50)
    private String orderNumber;

    @Column(nullable = false)
    private Long customerId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus orderStatus;

    // 배송 정보
    @Column(length = 100)
    private String recipientName;

    @Column(length = 20)
    private String recipientPhone;

    @Column(length = 10)
    private String shippingPostalCode;

    private String shippingAddress;

    private String shippingAddressDetail;

    private String shippingMemo;

    // 결제 정보
    private Long paymentId;

    // 취소 정보
    private String cancelReason;

    private LocalDateTime cancelledAt;

    // 완료 정보
    private LocalDateTime completedAt;

    // 배송 추적 정보
    @Column(length = 50)
    private String trackingNumber;

    @Column(length = 50)
    private String trackingCompany;

    // 관리자 메모
    @Column(length = 1000)
    private String adminMemo;

    @Builder
    public Order(Long customerId, String recipientName, String recipientPhone,
                 String shippingPostalCode, String shippingAddress,
                 String shippingAddressDetail, String shippingMemo) {
        this.orderNumber = generateOrderNumber();
        this.customerId = customerId;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.shippingPostalCode = shippingPostalCode;
        this.shippingAddress = shippingAddress;
        this.shippingAddressDetail = shippingAddressDetail;
        this.shippingMemo = shippingMemo;
        this.orderStatus = OrderStatus.PENDING;
        this.totalAmount = BigDecimal.ZERO;
    }

    // 도메인 메서드

    /**
     * 주문 상품 추가
     */
    public OrderItem addItem(Long productId, String productName, String productImageUrl,
                             int quantity, BigDecimal price) {
        OrderItem item = OrderItem.builder()
                .order(this)
                .productId(productId)
                .productName(productName)
                .productImageUrl(productImageUrl)
                .quantity(quantity)
                .price(price)
                .build();

        this.items.add(item);
        calculateTotalAmount();

        return item;
    }

    /**
     * 주문 생성 완료 (이벤트 발행)
     */
    public void place() {
        if (this.items.isEmpty()) {
            throw new IllegalStateException("주문 상품이 없습니다.");
        }

        calculateTotalAmount();
        addDomainEvent(new OrderPlacedEvent(
            this.getId(), this.orderNumber, this.customerId, this.totalAmount));
    }

    /**
     * 주문 확인 (결제 완료 후)
     */
    public void confirm(Long paymentId) {
        if (this.orderStatus != OrderStatus.PENDING) {
            throw new IllegalStateException("주문 대기 상태에서만 확인할 수 있습니다. 현재 상태: " + this.orderStatus);
        }

        this.orderStatus = OrderStatus.CONFIRMED;
        this.paymentId = paymentId;

        addDomainEvent(new OrderConfirmedEvent(
            this.getId(), this.orderNumber, this.customerId, this.paymentId));
    }

    /**
     * 상품 준비 시작
     */
    public void startPreparing() {
        if (this.orderStatus != OrderStatus.CONFIRMED) {
            throw new IllegalStateException("주문 확인 상태에서만 준비를 시작할 수 있습니다.");
        }
        this.orderStatus = OrderStatus.PREPARING;
    }

    /**
     * 배송 시작
     */
    public void ship() {
        if (this.orderStatus != OrderStatus.PREPARING) {
            throw new IllegalStateException("상품 준비중 상태에서만 배송을 시작할 수 있습니다.");
        }
        this.orderStatus = OrderStatus.SHIPPED;
    }

    /**
     * 배송 완료
     */
    public void deliver() {
        if (this.orderStatus != OrderStatus.SHIPPED) {
            throw new IllegalStateException("배송중 상태에서만 배송 완료 처리할 수 있습니다.");
        }
        this.orderStatus = OrderStatus.DELIVERED;
    }

    /**
     * 구매 확정
     */
    public void complete() {
        if (!this.orderStatus.isCompletable()) {
            throw new IllegalStateException("배송 완료 상태에서만 구매 확정할 수 있습니다. 현재 상태: " + this.orderStatus);
        }

        this.orderStatus = OrderStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();

        addDomainEvent(new OrderCompletedEvent(
            this.getId(), this.orderNumber, this.customerId));
    }

    /**
     * 주문 취소
     */
    public void cancel(String reason) {
        if (!this.orderStatus.isCancellable()) {
            throw new IllegalStateException("취소할 수 없는 주문 상태입니다. 현재 상태: " + this.orderStatus);
        }

        this.orderStatus = OrderStatus.CANCELLED;
        this.cancelReason = reason;
        this.cancelledAt = LocalDateTime.now();

        addDomainEvent(new OrderCancelledEvent(
            this.getId(), this.orderNumber, this.customerId, this.paymentId, reason));
    }

    /**
     * 총액 계산
     */
    private void calculateTotalAmount() {
        this.totalAmount = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * 주문번호 생성
     */
    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /**
     * 주문 상품 개수
     */
    public int getItemCount() {
        return items.size();
    }

    /**
     * 총 상품 수량
     */
    public int getTotalQuantity() {
        return items.stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();
    }

    /**
     * 취소된 주문인지 확인
     */
    public boolean isCancelled() {
        return this.orderStatus == OrderStatus.CANCELLED;
    }

    /**
     * 완료된 주문인지 확인
     */
    public boolean isCompleted() {
        return this.orderStatus == OrderStatus.COMPLETED;
    }

    // ========== Admin 전용 메서드 ==========

    /**
     * 관리자에 의한 주문 상태 변경
     */
    public void updateStatusByAdmin(OrderStatus newStatus) {
        this.orderStatus = newStatus;
    }

    /**
     * 배송 정보 업데이트 (관리자)
     */
    public void updateShippingInfo(String trackingNumber, String trackingCompany) {
        this.trackingNumber = trackingNumber;
        this.trackingCompany = trackingCompany;

        // 배송 정보 입력 시 배송중 상태로 변경
        if (this.orderStatus == OrderStatus.PREPARING || this.orderStatus == OrderStatus.CONFIRMED) {
            this.orderStatus = OrderStatus.SHIPPED;
        }
    }

    /**
     * 관리자 메모 업데이트
     */
    public void updateAdminMemo(String memo) {
        this.adminMemo = memo;
    }
}

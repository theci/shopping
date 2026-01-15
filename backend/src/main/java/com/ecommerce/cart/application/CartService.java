package com.ecommerce.cart.application;

import com.ecommerce.cart.domain.Cart;
import com.ecommerce.cart.domain.CartItem;
import com.ecommerce.cart.domain.CartRepository;
import com.ecommerce.cart.dto.*;
import com.ecommerce.cart.exception.CartItemNotFoundException;
import com.ecommerce.product.domain.Product;
import com.ecommerce.product.domain.ProductRepository;
import com.ecommerce.product.exception.InsufficientStockException;
import com.ecommerce.product.exception.ProductNotFoundException;
import com.ecommerce.shared.infrastructure.DomainEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Cart Service
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartMapper cartMapper;
    private final DomainEventPublisher domainEventPublisher;

    /**
     * 내 장바구니 조회
     */
    public CartResponse getMyCart(Long customerId) {
        Cart cart = getOrCreateCart(customerId);
        return cartMapper.toResponse(cart);
    }

    /**
     * 장바구니에 상품 추가
     */
    @Transactional
    public CartResponse addItem(Long customerId, CartItemRequest request) {
        // 상품 조회 및 검증
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(request.getProductId()));

        // 재고 확인
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new InsufficientStockException(product.getId(), product.getStockQuantity(), request.getQuantity());
        }

        // 장바구니 조회 또는 생성
        Cart cart = getOrCreateCart(customerId);

        // 첫 번째 이미지 URL 가져오기
        String imageUrl = product.getImages().isEmpty() ? null : product.getImages().get(0).getImageUrl();

        // 아이템 추가
        cart.addItem(
                product.getId(),
                product.getName(),
                imageUrl,
                request.getQuantity(),
                product.getPrice()
        );

        Cart savedCart = cartRepository.save(cart);
        domainEventPublisher.publishEvents(savedCart);

        log.info("장바구니에 상품 추가: customerId={}, productId={}, quantity={}",
                customerId, request.getProductId(), request.getQuantity());

        return cartMapper.toResponse(savedCart);
    }

    /**
     * 장바구니 아이템 수량 변경
     */
    @Transactional
    public CartResponse updateItemQuantity(Long customerId, Long itemId, CartItemQuantityRequest request) {
        Cart cart = getOrCreateCart(customerId);

        // 아이템 찾기
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new CartItemNotFoundException(itemId));

        // 재고 확인
        Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(item.getProductId()));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new InsufficientStockException(product.getId(), product.getStockQuantity(), request.getQuantity());
        }

        // 수량 변경
        item.changeQuantity(request.getQuantity());

        Cart savedCart = cartRepository.save(cart);
        domainEventPublisher.publishEvents(savedCart);

        log.info("장바구니 아이템 수량 변경: customerId={}, itemId={}, quantity={}",
                customerId, itemId, request.getQuantity());

        return cartMapper.toResponse(savedCart);
    }

    /**
     * 장바구니 아이템 삭제
     */
    @Transactional
    public CartResponse removeItem(Long customerId, Long itemId) {
        Cart cart = getOrCreateCart(customerId);

        cart.removeItemById(itemId);

        Cart savedCart = cartRepository.save(cart);
        domainEventPublisher.publishEvents(savedCart);

        log.info("장바구니 아이템 삭제: customerId={}, itemId={}", customerId, itemId);

        return cartMapper.toResponse(savedCart);
    }

    /**
     * 장바구니 비우기
     */
    @Transactional
    public void clearCart(Long customerId) {
        Cart cart = getOrCreateCart(customerId);

        cart.clear();

        cartRepository.save(cart);
        domainEventPublisher.publishEvents(cart);

        log.info("장바구니 비우기: customerId={}", customerId);
    }

    /**
     * 장바구니 조회 또는 생성
     */
    private Cart getOrCreateCart(Long customerId) {
        return cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .customerId(customerId)
                            .build();
                    return cartRepository.save(newCart);
                });
    }
}

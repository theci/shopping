package com.ecommerce.shipping.application;

import com.ecommerce.shared.dto.PageResponse;
import com.ecommerce.shared.infrastructure.DomainEventPublisher;
import com.ecommerce.shipping.domain.Shipping;
import com.ecommerce.shipping.domain.ShippingAddress;
import com.ecommerce.shipping.domain.ShippingRepository;
import com.ecommerce.shipping.domain.ShippingStatus;
import com.ecommerce.shipping.dto.*;
import com.ecommerce.shipping.exception.ShippingAlreadyExistsException;
import com.ecommerce.shipping.exception.ShippingNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Shipping 애플리케이션 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShippingService {

    private final ShippingRepository shippingRepository;
    private final DomainEventPublisher eventPublisher;
    private final ShippingMapper shippingMapper;

    /**
     * 배송 생성
     */
    @Transactional
    public ShippingResponse createShipping(ShippingCreateRequest request) {
        log.info("배송 생성: orderId={}", request.getOrderId());

        // 이미 배송이 존재하는지 확인
        if (shippingRepository.existsByOrderId(request.getOrderId())) {
            throw new ShippingAlreadyExistsException(request.getOrderId());
        }

        ShippingAddress address = ShippingAddress.builder()
                .recipientName(request.getRecipientName())
                .recipientPhone(request.getRecipientPhone())
                .postalCode(request.getPostalCode())
                .address(request.getAddress())
                .addressDetail(request.getAddressDetail())
                .build();

        Shipping shipping = Shipping.builder()
                .orderId(request.getOrderId())
                .shippingAddress(address)
                .shippingMemo(request.getShippingMemo())
                .build();

        Shipping savedShipping = shippingRepository.save(shipping);
        log.info("배송 생성 완료: shippingId={}, orderId={}", savedShipping.getId(), savedShipping.getOrderId());

        return shippingMapper.toResponse(savedShipping);
    }

    /**
     * 배송 조회
     */
    public ShippingResponse getShipping(Long shippingId) {
        Shipping shipping = shippingRepository.findById(shippingId)
                .orElseThrow(() -> new ShippingNotFoundException(shippingId));
        return shippingMapper.toResponse(shipping);
    }

    /**
     * 주문 ID로 배송 조회
     */
    public ShippingResponse getShippingByOrderId(Long orderId) {
        Shipping shipping = shippingRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ShippingNotFoundException("orderId: " + orderId));
        return shippingMapper.toResponse(shipping);
    }

    /**
     * 송장번호로 배송 추적
     */
    public ShippingResponse trackByTrackingNumber(String trackingNumber) {
        Shipping shipping = shippingRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ShippingNotFoundException("송장번호: " + trackingNumber));
        return shippingMapper.toResponse(shipping);
    }

    /**
     * 배송 목록 조회
     */
    public PageResponse<ShippingResponse> getShippings(ShippingSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());

        Page<Shipping> shippingPage;
        if (request.getStatus() != null) {
            shippingPage = shippingRepository.findByShippingStatus(request.getStatus(), pageable);
        } else {
            shippingPage = shippingRepository.findAll(pageable);
        }

        Page<ShippingResponse> responsePage = shippingPage.map(shippingMapper::toResponse);
        return PageResponse.of(responsePage);
    }

    /**
     * 배송 준비 시작 (관리자)
     */
    @Transactional
    public ShippingResponse startPreparing(Long shippingId, String shippingCompany) {
        log.info("배송 준비 시작: shippingId={}, company={}", shippingId, shippingCompany);

        Shipping shipping = shippingRepository.findById(shippingId)
                .orElseThrow(() -> new ShippingNotFoundException(shippingId));

        shipping.startPreparing(shippingCompany);
        Shipping savedShipping = shippingRepository.save(shipping);

        eventPublisher.publishEvents(savedShipping);

        log.info("배송 준비 시작 완료: shippingId={}", shippingId);
        return shippingMapper.toResponse(savedShipping);
    }

    /**
     * 집하 완료 (관리자)
     */
    @Transactional
    public ShippingResponse pickUp(Long shippingId, String trackingNumber) {
        log.info("집하 완료: shippingId={}, trackingNumber={}", shippingId, trackingNumber);

        Shipping shipping = shippingRepository.findById(shippingId)
                .orElseThrow(() -> new ShippingNotFoundException(shippingId));

        shipping.pickUp(trackingNumber);
        Shipping savedShipping = shippingRepository.save(shipping);

        log.info("집하 완료 처리: shippingId={}", shippingId);
        return shippingMapper.toResponse(savedShipping);
    }

    /**
     * 배송 상태 업데이트 (관리자)
     */
    @Transactional
    public ShippingResponse updateStatus(Long shippingId, ShippingStatusUpdateRequest request) {
        log.info("배송 상태 업데이트: shippingId={}, newStatus={}", shippingId, request.getStatus());

        Shipping shipping = shippingRepository.findById(shippingId)
                .orElseThrow(() -> new ShippingNotFoundException(shippingId));

        // 송장번호 업데이트 (제공된 경우)
        if (request.getTrackingNumber() != null && !request.getTrackingNumber().isBlank()) {
            shipping.updateTrackingNumber(request.getTrackingNumber());
        }

        // 상태 업데이트
        shipping.updateStatus(request.getStatus());
        Shipping savedShipping = shippingRepository.save(shipping);

        eventPublisher.publishEvents(savedShipping);

        log.info("배송 상태 업데이트 완료: shippingId={}, newStatus={}", shippingId, request.getStatus());
        return shippingMapper.toResponse(savedShipping);
    }

    /**
     * 배송 완료 처리 (관리자)
     */
    @Transactional
    public ShippingResponse completeDelivery(Long shippingId) {
        log.info("배송 완료 처리: shippingId={}", shippingId);

        Shipping shipping = shippingRepository.findById(shippingId)
                .orElseThrow(() -> new ShippingNotFoundException(shippingId));

        shipping.complete();
        Shipping savedShipping = shippingRepository.save(shipping);

        eventPublisher.publishEvents(savedShipping);

        log.info("배송 완료 처리 완료: shippingId={}", shippingId);
        return shippingMapper.toResponse(savedShipping);
    }
}

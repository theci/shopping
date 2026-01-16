package com.ecommerce.payment.application;

import com.ecommerce.order.domain.Order;
import com.ecommerce.order.domain.OrderRepository;
import com.ecommerce.order.exception.OrderNotFoundException;
import com.ecommerce.payment.domain.Payment;
import com.ecommerce.payment.domain.PaymentGateway;
import com.ecommerce.payment.domain.PaymentRepository;
import com.ecommerce.payment.dto.*;
import com.ecommerce.payment.exception.PaymentAlreadyExistsException;
import com.ecommerce.payment.exception.PaymentNotFoundException;
import com.ecommerce.payment.exception.PaymentProcessingException;
import com.ecommerce.payment.exception.PaymentRefundException;
import com.ecommerce.payment.infrastructure.gateway.TossPaymentGateway;
import com.ecommerce.shared.infrastructure.DomainEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Payment 애플리케이션 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PaymentGateway paymentGateway;
    private final TossPaymentGateway tossPaymentGateway;
    private final DomainEventPublisher eventPublisher;
    private final PaymentMapper paymentMapper;

    /**
     * 결제 요청 (결제 초기화)
     */
    @Transactional
    public PaymentInitResponse initiatePayment(Long customerId, PaymentRequest request) {
        log.info("결제 요청 시작: customerId={}, orderId={}", customerId, request.getOrderId());

        // 주문 조회 및 검증
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new OrderNotFoundException(request.getOrderId()));

        // 본인 주문인지 확인
        if (!order.getCustomerId().equals(customerId)) {
            throw new IllegalStateException("본인의 주문에 대해서만 결제할 수 있습니다.");
        }

        // 이미 결제가 존재하는지 확인
        if (paymentRepository.existsByOrderId(request.getOrderId())) {
            throw new PaymentAlreadyExistsException(request.getOrderId());
        }

        // Payment 엔티티 생성
        Payment payment = Payment.builder()
                .orderId(order.getId())
                .amount(order.getTotalAmount())
                .paymentMethod(request.getPaymentMethod())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // PG사 결제 요청
        PaymentGateway.PaymentInitRequest pgRequest = new PaymentGateway.PaymentInitRequest(
                "ORD-" + order.getId(),
                order.getTotalAmount(),
                "주문 결제",
                order.getRecipientName(),
                null,
                request.getPaymentMethod(),
                request.getSuccessUrl(),
                request.getFailUrl()
        );

        PaymentGateway.PaymentInitResponse pgResponse = paymentGateway.initiate(pgRequest);

        if (!pgResponse.success()) {
            log.error("결제 초기화 실패: {}", pgResponse.errorMessage());
            throw new PaymentProcessingException(pgResponse.errorCode(), pgResponse.errorMessage());
        }

        // Payment 상태 업데이트
        savedPayment.startProcessing(tossPaymentGateway.getProviderName(), pgResponse.paymentKey());
        paymentRepository.save(savedPayment);

        log.info("결제 요청 완료: paymentId={}, paymentKey={}", savedPayment.getId(), pgResponse.paymentKey());

        return PaymentInitResponse.builder()
                .paymentId(savedPayment.getId())
                .paymentKey(pgResponse.paymentKey())
                .clientKey(tossPaymentGateway.getClientKey())
                .checkoutUrl(pgResponse.checkoutUrl())
                .success(true)
                .build();
    }

    /**
     * 결제 승인
     */
    @Transactional
    public PaymentResponse confirmPayment(PaymentConfirmRequest request) {
        log.info("결제 승인 시작: paymentKey={}, orderId={}", request.getPaymentKey(), request.getOrderId());

        // Payment 조회
        Payment payment = paymentRepository.findByPaymentKey(request.getPaymentKey())
                .orElseThrow(() -> new PaymentNotFoundException("paymentKey: " + request.getPaymentKey()));

        // 금액 검증
        if (payment.getAmount().compareTo(request.getAmount()) != 0) {
            throw new PaymentProcessingException("결제 금액이 일치하지 않습니다.");
        }

        // PG사 결제 승인
        PaymentGateway.PaymentConfirmRequest pgRequest = new PaymentGateway.PaymentConfirmRequest(
                request.getPaymentKey(),
                request.getOrderId(),
                request.getAmount()
        );

        PaymentGateway.PaymentConfirmResponse pgResponse = paymentGateway.confirm(pgRequest);

        if (!pgResponse.success()) {
            payment.fail(pgResponse.errorMessage());
            paymentRepository.save(payment);
            eventPublisher.publishEvents(payment);
            throw new PaymentProcessingException(pgResponse.errorCode(), pgResponse.errorMessage());
        }

        // 결제 완료 처리
        payment.complete(pgResponse.transactionId(), pgResponse.pgTransactionId());
        Payment savedPayment = paymentRepository.save(payment);

        // 도메인 이벤트 발행
        eventPublisher.publishEvents(savedPayment);

        log.info("결제 승인 완료: paymentId={}, transactionId={}", savedPayment.getId(), pgResponse.transactionId());

        return paymentMapper.toResponse(savedPayment);
    }

    /**
     * 결제 조회
     */
    public PaymentResponse getPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));
        return paymentMapper.toResponse(payment);
    }

    /**
     * 주문 ID로 결제 조회
     */
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new PaymentNotFoundException("orderId: " + orderId));
        return paymentMapper.toResponse(payment);
    }

    /**
     * 환불 처리
     */
    @Transactional
    public PaymentResponse refundPayment(Long paymentId, RefundRequest request) {
        log.info("환불 요청 시작: paymentId={}, amount={}", paymentId, request.getAmount());

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));

        // 환불 가능 금액 검증
        BigDecimal refundAmount = request.getAmount() != null ? request.getAmount() : payment.getAmount();
        if (refundAmount.compareTo(payment.getRefundableAmount()) > 0) {
            throw new PaymentRefundException("환불 가능 금액을 초과했습니다. 환불 가능 금액: " + payment.getRefundableAmount());
        }

        // PG사 환불 요청
        PaymentGateway.PaymentRefundResponse pgResponse = paymentGateway.refund(
                payment.getPaymentKey(),
                refundAmount,
                request.getReason()
        );

        if (!pgResponse.success()) {
            throw new PaymentRefundException(pgResponse.errorCode(), pgResponse.errorMessage());
        }

        // 환불 처리
        payment.refund(refundAmount, request.getReason());
        Payment savedPayment = paymentRepository.save(payment);

        // 도메인 이벤트 발행
        eventPublisher.publishEvents(savedPayment);

        log.info("환불 완료: paymentId={}, refundAmount={}", paymentId, refundAmount);

        return paymentMapper.toResponse(savedPayment);
    }

    /**
     * 결제 취소 (결제 완료 전)
     */
    @Transactional
    public PaymentResponse cancelPayment(Long paymentId, String reason) {
        log.info("결제 취소 요청: paymentId={}, reason={}", paymentId, reason);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));

        // PG사 결제 취소
        if (payment.getPaymentKey() != null) {
            PaymentGateway.PaymentCancelResponse pgResponse = paymentGateway.cancel(
                    payment.getPaymentKey(),
                    reason
            );

            if (!pgResponse.success()) {
                throw new PaymentProcessingException(pgResponse.errorCode(), pgResponse.errorMessage());
            }
        }

        // 취소 처리
        payment.cancel(reason);
        Payment savedPayment = paymentRepository.save(payment);

        log.info("결제 취소 완료: paymentId={}", paymentId);

        return paymentMapper.toResponse(savedPayment);
    }
}

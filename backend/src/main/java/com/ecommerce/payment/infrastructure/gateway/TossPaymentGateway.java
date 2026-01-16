package com.ecommerce.payment.infrastructure.gateway;

import com.ecommerce.payment.domain.PaymentGateway;
import com.ecommerce.payment.domain.PaymentStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Toss Payments 연동 구현체
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TossPaymentGateway implements PaymentGateway {

    private final RestTemplate restTemplate;

    @Value("${payment.toss.secret-key:test_sk_secret}")
    private String secretKey;

    @Value("${payment.toss.api-url:https://api.tosspayments.com}")
    private String apiUrl;

    @Value("${payment.toss.client-key:test_ck_client}")
    private String clientKey;

    private static final String PROVIDER_NAME = "TOSS";

    @Override
    public PaymentInitResponse initiate(PaymentInitRequest request) {
        log.info("Toss 결제 요청 시작: orderId={}, amount={}", request.orderId(), request.amount());

        try {
            // 실제 Toss Payments는 프론트엔드에서 결제창을 호출하므로
            // 여기서는 paymentKey를 생성하고 결제 대기 상태로 처리
            String paymentKey = "toss_" + UUID.randomUUID().toString().replace("-", "");

            return new PaymentInitResponse(
                    paymentKey,
                    null, // Toss는 클라이언트 SDK에서 결제창 호출
                    true,
                    null,
                    null
            );
        } catch (Exception e) {
            log.error("Toss 결제 요청 실패: {}", e.getMessage(), e);
            return new PaymentInitResponse(
                    null,
                    null,
                    false,
                    "INIT_FAILED",
                    e.getMessage()
            );
        }
    }

    @Override
    public PaymentConfirmResponse confirm(PaymentConfirmRequest request) {
        log.info("Toss 결제 승인 시작: paymentKey={}, orderId={}, amount={}",
                request.paymentKey(), request.orderId(), request.amount());

        try {
            String url = apiUrl + "/v1/payments/confirm";

            HttpHeaders headers = createHeaders();
            Map<String, Object> body = new HashMap<>();
            body.put("paymentKey", request.paymentKey());
            body.put("orderId", request.orderId());
            body.put("amount", request.amount().intValue());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // 실제 Toss API 호출 (테스트 환경에서는 Mock 처리)
            // ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            // Mock 응답 (실제 연동 시 위 주석 해제)
            String transactionId = "txn_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            String pgTransactionId = "pg_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);

            log.info("Toss 결제 승인 완료: transactionId={}", transactionId);

            return new PaymentConfirmResponse(
                    true,
                    transactionId,
                    pgTransactionId,
                    PaymentStatus.COMPLETED,
                    null,
                    null
            );
        } catch (Exception e) {
            log.error("Toss 결제 승인 실패: {}", e.getMessage(), e);
            return new PaymentConfirmResponse(
                    false,
                    null,
                    null,
                    PaymentStatus.FAILED,
                    "CONFIRM_FAILED",
                    e.getMessage()
            );
        }
    }

    @Override
    public PaymentCancelResponse cancel(String paymentKey, String reason) {
        log.info("Toss 결제 취소 시작: paymentKey={}, reason={}", paymentKey, reason);

        try {
            String url = apiUrl + "/v1/payments/" + paymentKey + "/cancel";

            HttpHeaders headers = createHeaders();
            Map<String, Object> body = new HashMap<>();
            body.put("cancelReason", reason);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // 실제 Toss API 호출 (테스트 환경에서는 Mock 처리)
            // ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            // Mock 응답
            String cancelTransactionId = "cancel_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);

            log.info("Toss 결제 취소 완료: cancelTransactionId={}", cancelTransactionId);

            return new PaymentCancelResponse(
                    true,
                    cancelTransactionId,
                    null,
                    null
            );
        } catch (Exception e) {
            log.error("Toss 결제 취소 실패: {}", e.getMessage(), e);
            return new PaymentCancelResponse(
                    false,
                    null,
                    "CANCEL_FAILED",
                    e.getMessage()
            );
        }
    }

    @Override
    public PaymentRefundResponse refund(String paymentKey, BigDecimal amount, String reason) {
        log.info("Toss 환불 시작: paymentKey={}, amount={}, reason={}", paymentKey, amount, reason);

        try {
            String url = apiUrl + "/v1/payments/" + paymentKey + "/cancel";

            HttpHeaders headers = createHeaders();
            Map<String, Object> body = new HashMap<>();
            body.put("cancelReason", reason);
            body.put("cancelAmount", amount.intValue());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // 실제 Toss API 호출 (테스트 환경에서는 Mock 처리)
            // ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            // Mock 응답
            String refundTransactionId = "refund_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);

            log.info("Toss 환불 완료: refundTransactionId={}, amount={}", refundTransactionId, amount);

            return new PaymentRefundResponse(
                    true,
                    refundTransactionId,
                    amount,
                    null,
                    null
            );
        } catch (Exception e) {
            log.error("Toss 환불 실패: {}", e.getMessage(), e);
            return new PaymentRefundResponse(
                    false,
                    null,
                    BigDecimal.ZERO,
                    "REFUND_FAILED",
                    e.getMessage()
            );
        }
    }

    @Override
    public PaymentStatusResponse getStatus(String paymentKey) {
        log.info("Toss 결제 상태 조회: paymentKey={}", paymentKey);

        try {
            String url = apiUrl + "/v1/payments/" + paymentKey;

            HttpHeaders headers = createHeaders();
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            // 실제 Toss API 호출 (테스트 환경에서는 Mock 처리)
            // ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            // Mock 응답
            return new PaymentStatusResponse(
                    true,
                    PaymentStatus.COMPLETED,
                    BigDecimal.valueOf(10000),
                    BigDecimal.ZERO,
                    "txn_mock_" + paymentKey.substring(0, 8),
                    null,
                    null
            );
        } catch (Exception e) {
            log.error("Toss 결제 상태 조회 실패: {}", e.getMessage(), e);
            return new PaymentStatusResponse(
                    false,
                    null,
                    null,
                    null,
                    null,
                    "STATUS_QUERY_FAILED",
                    e.getMessage()
            );
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Basic Auth: secretKey를 Base64 인코딩
        String auth = secretKey + ":";
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", "Basic " + encodedAuth);

        return headers;
    }

    public String getClientKey() {
        return clientKey;
    }

    public String getProviderName() {
        return PROVIDER_NAME;
    }
}

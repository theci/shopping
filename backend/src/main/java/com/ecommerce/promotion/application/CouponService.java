package com.ecommerce.promotion.application;

import com.ecommerce.promotion.domain.Coupon;
import com.ecommerce.promotion.domain.CouponIssue;
import com.ecommerce.promotion.domain.CouponRepository;
import com.ecommerce.promotion.dto.CouponCreateRequest;
import com.ecommerce.promotion.dto.CouponDiscountRequest;
import com.ecommerce.promotion.dto.CouponDiscountResponse;
import com.ecommerce.promotion.dto.CouponIssueResponse;
import com.ecommerce.promotion.dto.CouponResponse;
import com.ecommerce.promotion.dto.MyCouponResponse;
import com.ecommerce.promotion.exception.CouponAlreadyUsedException;
import com.ecommerce.promotion.exception.CouponExpiredException;
import com.ecommerce.promotion.exception.CouponNotFoundException;
import com.ecommerce.promotion.exception.CouponNotIssuedException;
import com.ecommerce.promotion.exception.DuplicateCouponCodeException;
import com.ecommerce.shared.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 쿠폰 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponMapper couponMapper;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * 쿠폰 생성
     */
    @Transactional
    public CouponResponse createCoupon(CouponCreateRequest request) {
        // 쿠폰 코드 중복 검사
        if (couponRepository.existsByCode(request.getCode())) {
            throw new DuplicateCouponCodeException(request.getCode());
        }

        Coupon coupon = Coupon.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minOrderAmount(request.getMinOrderAmount())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .couponType(request.getCouponType())
                .totalQuantity(request.getTotalQuantity())
                .validFrom(request.getValidFrom())
                .validUntil(request.getValidUntil())
                .build();

        Coupon savedCoupon = couponRepository.save(coupon);
        return couponMapper.toCouponResponse(savedCoupon);
    }

    /**
     * 쿠폰 조회 (ID)
     */
    public CouponResponse getCoupon(Long couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new CouponNotFoundException(couponId));
        return couponMapper.toCouponResponse(coupon);
    }

    /**
     * 쿠폰 조회 (코드)
     */
    public CouponResponse getCouponByCode(String code) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new CouponNotFoundException(code));
        return couponMapper.toCouponResponse(coupon);
    }

    /**
     * 활성 쿠폰 목록 조회
     */
    public PageResponse<CouponResponse> getActiveCoupons(Pageable pageable) {
        Page<CouponResponse> page = couponRepository.findActiveCoupons(LocalDateTime.now(), pageable)
                .map(couponMapper::toCouponResponse);
        return PageResponse.of(page);
    }

    /**
     * 전체 쿠폰 목록 조회 (관리자용)
     */
    public PageResponse<CouponResponse> getAllCoupons(Pageable pageable) {
        Page<CouponResponse> page = couponRepository.findAll(pageable)
                .map(couponMapper::toCouponResponse);
        return PageResponse.of(page);
    }

    /**
     * 쿠폰 발급
     */
    @Transactional
    public CouponIssueResponse issueCoupon(Long couponId, Long customerId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new CouponNotFoundException(couponId));

        // 쿠폰 발급
        CouponIssue issue = coupon.issue(customerId);

        Coupon savedCoupon = couponRepository.save(coupon);

        // 도메인 이벤트 발행
        savedCoupon.getDomainEvents().forEach(eventPublisher::publishEvent);
        savedCoupon.clearDomainEvents();

        return couponMapper.toCouponIssueResponse(issue, coupon);
    }

    /**
     * 코드로 쿠폰 발급
     */
    @Transactional
    public CouponIssueResponse issueCouponByCode(String code, Long customerId) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new CouponNotFoundException(code));

        CouponIssue issue = coupon.issue(customerId);

        Coupon savedCoupon = couponRepository.save(coupon);

        savedCoupon.getDomainEvents().forEach(eventPublisher::publishEvent);
        savedCoupon.clearDomainEvents();

        return couponMapper.toCouponIssueResponse(issue, coupon);
    }

    /**
     * 내 쿠폰 목록 조회
     */
    public List<MyCouponResponse> getMyCoupons(Long customerId) {
        List<CouponIssue> issues = couponRepository.findCouponIssuesByCustomerId(customerId);
        return issues.stream()
                .map(issue -> couponMapper.toMyCouponResponse(issue, issue.getCoupon()))
                .collect(Collectors.toList());
    }

    /**
     * 사용 가능한 내 쿠폰 목록 조회
     */
    public List<MyCouponResponse> getMyAvailableCoupons(Long customerId) {
        List<CouponIssue> issues = couponRepository.findAvailableCouponIssuesByCustomerId(customerId, LocalDateTime.now());
        return issues.stream()
                .map(issue -> couponMapper.toMyCouponResponse(issue, issue.getCoupon()))
                .collect(Collectors.toList());
    }

    /**
     * 쿠폰 할인 금액 계산 (쿠폰 ID 기반)
     */
    public CouponDiscountResponse calculateDiscount(Long couponId, Long customerId, CouponDiscountRequest request) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new CouponNotFoundException(couponId));

        // 유효성 검증
        if (!coupon.isValid()) {
            return CouponDiscountResponse.builder()
                    .couponId(coupon.getId())
                    .couponCode(coupon.getCode())
                    .couponName(coupon.getName())
                    .orderAmount(request.getOrderAmount())
                    .discountAmount(BigDecimal.ZERO)
                    .finalAmount(request.getOrderAmount())
                    .applicable(false)
                    .message("쿠폰 유효기간이 만료되었습니다.")
                    .build();
        }

        // 최소 주문 금액 검증
        if (request.getOrderAmount().compareTo(coupon.getMinOrderAmount()) < 0) {
            return CouponDiscountResponse.builder()
                    .couponId(coupon.getId())
                    .couponCode(coupon.getCode())
                    .couponName(coupon.getName())
                    .orderAmount(request.getOrderAmount())
                    .discountAmount(BigDecimal.ZERO)
                    .finalAmount(request.getOrderAmount())
                    .applicable(false)
                    .message(String.format("최소 주문 금액은 %s원입니다.", coupon.getMinOrderAmount()))
                    .build();
        }

        // 할인 금액 계산
        BigDecimal discountAmount = coupon.calculateDiscount(request.getOrderAmount());

        return CouponDiscountResponse.builder()
                .couponId(coupon.getId())
                .couponCode(coupon.getCode())
                .couponName(coupon.getName())
                .orderAmount(request.getOrderAmount())
                .discountAmount(discountAmount)
                .finalAmount(request.getOrderAmount().subtract(discountAmount))
                .applicable(true)
                .message("쿠폰 적용 가능")
                .build();
    }

    /**
     * 쿠폰 사용
     */
    @Transactional
    public BigDecimal useCoupon(Long couponId, Long customerId, Long orderId, BigDecimal orderAmount) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new CouponNotFoundException(couponId));

        // 쿠폰 사용 처리
        BigDecimal discountAmount = coupon.use(customerId, orderId, orderAmount);

        Coupon savedCoupon = couponRepository.save(coupon);

        // 도메인 이벤트 발행
        savedCoupon.getDomainEvents().forEach(eventPublisher::publishEvent);
        savedCoupon.clearDomainEvents();

        return discountAmount;
    }

    /**
     * 쿠폰 사용 취소
     */
    @Transactional
    public void cancelCouponUsage(Long couponId, Long customerId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new CouponNotFoundException(couponId));

        // 쿠폰 사용 취소
        coupon.cancelUse(customerId);

        couponRepository.save(coupon);
    }

    /**
     * 쿠폰 비활성화
     */
    @Transactional
    public void deactivateCoupon(Long couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new CouponNotFoundException(couponId));

        coupon.deactivate();
        couponRepository.save(coupon);
    }

    /**
     * 쿠폰 활성화
     */
    @Transactional
    public void activateCoupon(Long couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new CouponNotFoundException(couponId));

        coupon.activate();
        couponRepository.save(coupon);
    }
}

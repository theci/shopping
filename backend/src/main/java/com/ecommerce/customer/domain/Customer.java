package com.ecommerce.customer.domain;

import com.ecommerce.customer.domain.event.CustomerRegisteredEvent;
import com.ecommerce.customer.domain.event.CustomerUpdatedEvent;
import com.ecommerce.customer.domain.event.CustomerWithdrawnEvent;
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

/**
 * 고객 Aggregate Root
 */
@Entity
@Table(name = "customers", indexes = {
    @Index(name = "idx_customer_email", columnList = "email", unique = true)
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Customer extends AggregateRoot {

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 20)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CustomerStatus status = CustomerStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CustomerLevel customerLevel = CustomerLevel.BRONZE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CustomerRole role = CustomerRole.CUSTOMER;

    @Column(precision = 15, scale = 2)
    private BigDecimal totalPurchaseAmount = BigDecimal.ZERO;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();

    private LocalDateTime lastLoginAt;

    private LocalDateTime withdrawnAt;

    private String withdrawnReason;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private OAuthProvider oauthProvider = OAuthProvider.LOCAL;

    private String oauthProviderId;

    @Builder
    public Customer(String email, String password, String name, String phoneNumber, CustomerRole role,
                    OAuthProvider oauthProvider, String oauthProviderId) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.status = CustomerStatus.ACTIVE;
        this.customerLevel = CustomerLevel.BRONZE;
        this.role = role != null ? role : CustomerRole.CUSTOMER;
        this.totalPurchaseAmount = BigDecimal.ZERO;
        this.oauthProvider = oauthProvider != null ? oauthProvider : OAuthProvider.LOCAL;
        this.oauthProviderId = oauthProviderId;
    }

    // 도메인 메서드

    /**
     * 회원가입 완료 처리
     */
    public void completeRegistration() {
        addDomainEvent(new CustomerRegisteredEvent(this.getId(), this.email, this.name));
    }

    /**
     * 프로필 업데이트
     */
    public void updateProfile(String name, String phoneNumber) {
        if (this.status == CustomerStatus.WITHDRAWN) {
            throw new IllegalStateException("탈퇴한 회원은 프로필을 수정할 수 없습니다.");
        }

        boolean changed = false;
        if (name != null && !name.equals(this.name)) {
            this.name = name;
            changed = true;
        }
        if (phoneNumber != null && !phoneNumber.equals(this.phoneNumber)) {
            this.phoneNumber = phoneNumber;
            changed = true;
        }

        if (changed) {
            addDomainEvent(new CustomerUpdatedEvent(this.getId(), this.email, this.name));
        }
    }

    /**
     * 비밀번호 변경
     */
    public void changePassword(String newEncodedPassword) {
        if (this.status == CustomerStatus.WITHDRAWN) {
            throw new IllegalStateException("탈퇴한 회원은 비밀번호를 변경할 수 없습니다.");
        }
        this.password = newEncodedPassword;
    }

    /**
     * 배송지 추가
     */
    public Address addAddress(String recipientName, String phoneNumber,
                              String postalCode, String address, String addressDetail, boolean isDefault) {
        if (this.status == CustomerStatus.WITHDRAWN) {
            throw new IllegalStateException("탈퇴한 회원은 배송지를 추가할 수 없습니다.");
        }

        // 기본 배송지로 설정 시 기존 기본 배송지 해제
        if (isDefault) {
            this.addresses.forEach(addr -> addr.setDefault(false));
        }

        // 첫 번째 주소인 경우 기본 배송지로 설정
        if (this.addresses.isEmpty()) {
            isDefault = true;
        }

        Address newAddress = Address.builder()
                .customer(this)
                .recipientName(recipientName)
                .phoneNumber(phoneNumber)
                .postalCode(postalCode)
                .address(address)
                .addressDetail(addressDetail)
                .isDefault(isDefault)
                .build();

        this.addresses.add(newAddress);
        return newAddress;
    }

    /**
     * 배송지 삭제
     */
    public void removeAddress(Long addressId) {
        Address addressToRemove = this.addresses.stream()
                .filter(addr -> addr.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("배송지를 찾을 수 없습니다."));

        boolean wasDefault = addressToRemove.isDefault();
        this.addresses.remove(addressToRemove);

        // 기본 배송지가 삭제된 경우 첫 번째 주소를 기본으로 설정
        if (wasDefault && !this.addresses.isEmpty()) {
            this.addresses.get(0).setDefault(true);
        }
    }

    /**
     * 기본 배송지 설정
     */
    public void setDefaultAddress(Long addressId) {
        this.addresses.forEach(addr -> {
            if (addr.getId().equals(addressId)) {
                addr.setDefault(true);
            } else {
                addr.setDefault(false);
            }
        });
    }

    /**
     * 회원 탈퇴
     */
    public void withdraw(String reason) {
        if (this.status == CustomerStatus.WITHDRAWN) {
            throw new IllegalStateException("이미 탈퇴한 회원입니다.");
        }

        this.status = CustomerStatus.WITHDRAWN;
        this.withdrawnAt = LocalDateTime.now();
        this.withdrawnReason = reason;

        addDomainEvent(new CustomerWithdrawnEvent(this.getId(), this.email, reason));
    }

    /**
     * 계정 차단
     */
    public void block() {
        if (this.status == CustomerStatus.WITHDRAWN) {
            throw new IllegalStateException("탈퇴한 회원은 차단할 수 없습니다.");
        }
        this.status = CustomerStatus.BLOCKED;
    }

    /**
     * 계정 활성화
     */
    public void activate() {
        if (this.status == CustomerStatus.WITHDRAWN) {
            throw new IllegalStateException("탈퇴한 회원은 활성화할 수 없습니다.");
        }
        this.status = CustomerStatus.ACTIVE;
    }

    /**
     * 관리자에 의한 상태 변경
     */
    public void updateStatusByAdmin(CustomerStatus newStatus) {
        if (this.status == CustomerStatus.WITHDRAWN && newStatus != CustomerStatus.WITHDRAWN) {
            throw new IllegalStateException("탈퇴한 회원의 상태는 변경할 수 없습니다.");
        }
        this.status = newStatus;
    }

    /**
     * 마지막 로그인 시간 업데이트
     */
    public void updateLastLoginAt() {
        this.lastLoginAt = LocalDateTime.now();
    }

    /**
     * 총 구매 금액 추가 및 등급 업데이트
     */
    public void addPurchaseAmount(BigDecimal amount) {
        this.totalPurchaseAmount = this.totalPurchaseAmount.add(amount);
        this.customerLevel = CustomerLevel.fromPurchaseAmount(this.totalPurchaseAmount);
    }

    /**
     * 로그인 가능 여부 확인
     */
    public boolean canLogin() {
        return this.status == CustomerStatus.ACTIVE;
    }

    /**
     * 기본 배송지 조회
     */
    public Address getDefaultAddress() {
        return this.addresses.stream()
                .filter(Address::isDefault)
                .findFirst()
                .orElse(null);
    }

    /**
     * OAuth 제공자 연결 (기존 LOCAL 계정에 OAuth 연결)
     */
    public void linkOAuthProvider(OAuthProvider provider, String providerId) {
        this.oauthProvider = provider;
        this.oauthProviderId = providerId;
    }

    /**
     * OAuth 로그인 사용자인지 확인
     */
    public boolean isOAuthUser() {
        return this.oauthProvider != null && this.oauthProvider != OAuthProvider.LOCAL;
    }
}

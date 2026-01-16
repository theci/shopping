package com.ecommerce.shipping.domain;

import com.ecommerce.shared.domain.AggregateRoot;
import com.ecommerce.shipping.domain.event.ShippingDeliveredEvent;
import com.ecommerce.shipping.domain.event.ShippingInTransitEvent;
import com.ecommerce.shipping.domain.event.ShippingOutForDeliveryEvent;
import com.ecommerce.shipping.domain.event.ShippingStartedEvent;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Shipping Aggregate Root
 */
@Entity
@Table(name = "shippings", indexes = {
        @Index(name = "idx_shipping_order_id", columnList = "order_id"),
        @Index(name = "idx_shipping_tracking_number", columnList = "tracking_number"),
        @Index(name = "idx_shipping_status", columnList = "shipping_status")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Shipping extends AggregateRoot {

    @Column(name = "order_id", nullable = false, unique = true)
    private Long orderId;

    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @Column(name = "shipping_company", length = 100)
    private String shippingCompany;

    @Enumerated(EnumType.STRING)
    @Column(name = "shipping_status", nullable = false, length = 50)
    private ShippingStatus shippingStatus;

    @Embedded
    private ShippingAddress shippingAddress;

    @Column(name = "shipping_memo", columnDefinition = "TEXT")
    private String shippingMemo;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "picked_up_at")
    private LocalDateTime pickedUpAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "estimated_delivery_date")
    private LocalDateTime estimatedDeliveryDate;

    @Builder
    public Shipping(Long orderId, ShippingAddress shippingAddress, String shippingMemo) {
        this.orderId = orderId;
        this.shippingAddress = shippingAddress;
        this.shippingMemo = shippingMemo;
        this.shippingStatus = ShippingStatus.PENDING;
    }

    /**
     * 배송 시작 (배송 준비)
     */
    public void startPreparing(String shippingCompany) {
        if (this.shippingStatus != ShippingStatus.PENDING) {
            throw new IllegalStateException("대기 상태에서만 배송 준비를 시작할 수 있습니다.");
        }
        this.shippingStatus = ShippingStatus.PREPARING;
        this.shippingCompany = shippingCompany;
        this.startedAt = LocalDateTime.now();

        registerEvent(new ShippingStartedEvent(
                this.getId(),
                this.orderId,
                this.shippingCompany
        ));
    }

    /**
     * 집하 완료
     */
    public void pickUp(String trackingNumber) {
        if (this.shippingStatus != ShippingStatus.PREPARING) {
            throw new IllegalStateException("준비 상태에서만 집하할 수 있습니다.");
        }
        this.shippingStatus = ShippingStatus.PICKED_UP;
        this.trackingNumber = trackingNumber;
        this.pickedUpAt = LocalDateTime.now();
        this.estimatedDeliveryDate = LocalDateTime.now().plusDays(2);
    }

    /**
     * 배송중으로 상태 변경
     */
    public void startTransit() {
        if (this.shippingStatus != ShippingStatus.PICKED_UP) {
            throw new IllegalStateException("집하 완료 상태에서만 배송을 시작할 수 있습니다.");
        }
        this.shippingStatus = ShippingStatus.IN_TRANSIT;

        registerEvent(new ShippingInTransitEvent(
                this.getId(),
                this.orderId,
                this.trackingNumber
        ));
    }

    /**
     * 배송 출발
     */
    public void outForDelivery() {
        if (this.shippingStatus != ShippingStatus.IN_TRANSIT) {
            throw new IllegalStateException("배송중 상태에서만 배송 출발할 수 있습니다.");
        }
        this.shippingStatus = ShippingStatus.OUT_FOR_DELIVERY;

        registerEvent(new ShippingOutForDeliveryEvent(
                this.getId(),
                this.orderId,
                this.trackingNumber,
                this.shippingAddress.getRecipientName()
        ));
    }

    /**
     * 배송 완료
     */
    public void complete() {
        if (this.shippingStatus != ShippingStatus.OUT_FOR_DELIVERY) {
            throw new IllegalStateException("배송 출발 상태에서만 배송 완료할 수 있습니다.");
        }
        this.shippingStatus = ShippingStatus.DELIVERED;
        this.deliveredAt = LocalDateTime.now();

        registerEvent(new ShippingDeliveredEvent(
                this.getId(),
                this.orderId,
                this.trackingNumber,
                this.deliveredAt
        ));
    }

    /**
     * 반송 처리
     */
    public void returnShipment(String reason) {
        if (this.shippingStatus == ShippingStatus.DELIVERED || this.shippingStatus == ShippingStatus.RETURNED) {
            throw new IllegalStateException("배송 완료 또는 반송 상태에서는 반송 처리할 수 없습니다.");
        }
        this.shippingStatus = ShippingStatus.RETURNED;
    }

    /**
     * 상태 업데이트 (관리자용)
     */
    public void updateStatus(ShippingStatus newStatus) {
        if (!this.shippingStatus.canUpdateTo(newStatus)) {
            throw new IllegalStateException(
                    String.format("'%s' 상태에서 '%s' 상태로 변경할 수 없습니다.",
                            this.shippingStatus.getDescription(),
                            newStatus.getDescription()));
        }

        ShippingStatus oldStatus = this.shippingStatus;
        this.shippingStatus = newStatus;

        // 상태별 이벤트 발행
        switch (newStatus) {
            case IN_TRANSIT -> registerEvent(new ShippingInTransitEvent(
                    this.getId(), this.orderId, this.trackingNumber));
            case OUT_FOR_DELIVERY -> registerEvent(new ShippingOutForDeliveryEvent(
                    this.getId(), this.orderId, this.trackingNumber,
                    this.shippingAddress.getRecipientName()));
            case DELIVERED -> {
                this.deliveredAt = LocalDateTime.now();
                registerEvent(new ShippingDeliveredEvent(
                        this.getId(), this.orderId, this.trackingNumber, this.deliveredAt));
            }
        }
    }

    /**
     * 송장번호 업데이트
     */
    public void updateTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    /**
     * 배송 완료 여부
     */
    public boolean isDelivered() {
        return this.shippingStatus.isDelivered();
    }
}

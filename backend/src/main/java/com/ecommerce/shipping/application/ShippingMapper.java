package com.ecommerce.shipping.application;

import com.ecommerce.shipping.domain.Shipping;
import com.ecommerce.shipping.domain.ShippingAddress;
import com.ecommerce.shipping.dto.ShippingResponse;
import org.springframework.stereotype.Component;

/**
 * Shipping Mapper
 */
@Component
public class ShippingMapper {

    public ShippingResponse toResponse(Shipping shipping) {
        ShippingAddress address = shipping.getShippingAddress();

        return ShippingResponse.builder()
                .id(shipping.getId())
                .orderId(shipping.getOrderId())
                .trackingNumber(shipping.getTrackingNumber())
                .shippingCompany(shipping.getShippingCompany())
                .shippingStatus(shipping.getShippingStatus())
                .shippingStatusDescription(shipping.getShippingStatus().getDescription())
                .recipientName(address != null ? address.getRecipientName() : null)
                .recipientPhone(address != null ? address.getRecipientPhone() : null)
                .postalCode(address != null ? address.getPostalCode() : null)
                .address(address != null ? address.getAddress() : null)
                .addressDetail(address != null ? address.getAddressDetail() : null)
                .fullAddress(address != null ? address.getFullAddress() : null)
                .shippingMemo(shipping.getShippingMemo())
                .startedAt(shipping.getStartedAt())
                .pickedUpAt(shipping.getPickedUpAt())
                .deliveredAt(shipping.getDeliveredAt())
                .estimatedDeliveryDate(shipping.getEstimatedDeliveryDate())
                .createdAt(shipping.getCreatedAt())
                .updatedAt(shipping.getUpdatedAt())
                .build();
    }
}

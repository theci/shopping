package com.ecommerce.customer.application;

import com.ecommerce.customer.domain.Address;
import com.ecommerce.customer.domain.Customer;
import com.ecommerce.customer.dto.AddressResponse;
import com.ecommerce.customer.dto.AdminCustomerListResponse;
import com.ecommerce.customer.dto.AdminCustomerResponse;
import com.ecommerce.customer.dto.CustomerResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Customer Mapper
 */
@Component
public class CustomerMapper {

    public CustomerResponse toResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .email(customer.getEmail())
                .name(customer.getName())
                .phoneNumber(customer.getPhoneNumber())
                .status(customer.getStatus())
                .customerLevel(customer.getCustomerLevel())
                .role(customer.getRole())
                .totalPurchaseAmount(customer.getTotalPurchaseAmount())
                .addresses(toAddressResponseList(customer.getAddresses()))
                .lastLoginAt(customer.getLastLoginAt())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }

    public AddressResponse toAddressResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .recipientName(address.getRecipientName())
                .phoneNumber(address.getPhoneNumber())
                .postalCode(address.getPostalCode())
                .address(address.getAddress())
                .addressDetail(address.getAddressDetail())
                .isDefault(address.isDefault())
                .createdAt(address.getCreatedAt())
                .build();
    }

    public List<AddressResponse> toAddressResponseList(List<Address> addresses) {
        if (addresses == null) {
            return List.of();
        }
        return addresses.stream()
                .map(this::toAddressResponse)
                .collect(Collectors.toList());
    }

    // ========== Admin용 매핑 메서드 ==========

    public AdminCustomerListResponse toAdminListResponse(Customer customer, int orderCount) {
        return AdminCustomerListResponse.builder()
                .id(customer.getId())
                .email(customer.getEmail())
                .name(customer.getName())
                .phone(customer.getPhoneNumber())
                .status(customer.getStatus())
                .orderCount(orderCount)
                .totalSpent(customer.getTotalPurchaseAmount())
                .createdAt(customer.getCreatedAt())
                .lastLoginAt(customer.getLastLoginAt())
                .build();
    }

    public AdminCustomerResponse toAdminResponse(Customer customer, int orderCount) {
        return AdminCustomerResponse.builder()
                .id(customer.getId())
                .email(customer.getEmail())
                .name(customer.getName())
                .phone(customer.getPhoneNumber())
                .status(customer.getStatus())
                .orderCount(orderCount)
                .totalSpent(customer.getTotalPurchaseAmount())
                .addresses(toAdminAddressInfoList(customer.getAddresses()))
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .lastLoginAt(customer.getLastLoginAt())
                .build();
    }

    private List<AdminCustomerResponse.AddressInfo> toAdminAddressInfoList(List<Address> addresses) {
        if (addresses == null) {
            return List.of();
        }
        return addresses.stream()
                .map(this::toAdminAddressInfo)
                .collect(Collectors.toList());
    }

    private AdminCustomerResponse.AddressInfo toAdminAddressInfo(Address address) {
        return AdminCustomerResponse.AddressInfo.builder()
                .id(address.getId())
                .recipientName(address.getRecipientName())
                .phone(address.getPhoneNumber())
                .zipCode(address.getPostalCode())
                .address(address.getAddress())
                .addressDetail(address.getAddressDetail())
                .isDefault(address.isDefault())
                .build();
    }
}

package com.ecommerce.customer.application;

import com.ecommerce.customer.domain.Address;
import com.ecommerce.customer.domain.Customer;
import com.ecommerce.customer.domain.CustomerRepository;
import com.ecommerce.customer.dto.*;
import com.ecommerce.customer.exception.CustomerNotFoundException;
import com.ecommerce.customer.exception.DuplicateEmailException;
import com.ecommerce.shared.infrastructure.DomainEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Customer Service
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final PasswordEncoder passwordEncoder;
    private final DomainEventPublisher domainEventPublisher;

    /**
     * 회원가입
     */
    @Transactional
    public CustomerResponse register(CustomerRegisterRequest request) {
        // 이메일 중복 체크
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        // Customer 생성
        Customer customer = Customer.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .build();

        Customer savedCustomer = customerRepository.save(customer);

        // 도메인 이벤트 등록 및 발행
        savedCustomer.completeRegistration();
        domainEventPublisher.publishEvents(savedCustomer);

        log.info("회원가입 완료: {}", savedCustomer.getEmail());
        return customerMapper.toResponse(savedCustomer);
    }

    /**
     * 내 정보 조회
     */
    public CustomerResponse getMyInfo(Long customerId) {
        Customer customer = findCustomerById(customerId);
        return customerMapper.toResponse(customer);
    }

    /**
     * 내 정보 수정
     */
    @Transactional
    public CustomerResponse updateMyInfo(Long customerId, CustomerUpdateRequest request) {
        Customer customer = findCustomerById(customerId);
        customer.updateProfile(request.getName(), request.getPhoneNumber());

        domainEventPublisher.publishEvents(customer);

        log.info("고객 정보 수정: {}", customer.getEmail());
        return customerMapper.toResponse(customer);
    }

    /**
     * 비밀번호 변경
     */
    @Transactional
    public void changePassword(Long customerId, PasswordChangeRequest request) {
        Customer customer = findCustomerById(customerId);

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(request.getCurrentPassword(), customer.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        customer.changePassword(passwordEncoder.encode(request.getNewPassword()));
        log.info("비밀번호 변경 완료: {}", customer.getEmail());
    }

    /**
     * 배송지 추가
     */
    @Transactional
    public AddressResponse addAddress(Long customerId, AddressRequest request) {
        Customer customer = findCustomerById(customerId);

        Address address = customer.addAddress(
                request.getRecipientName(),
                request.getPhoneNumber(),
                request.getPostalCode(),
                request.getAddress(),
                request.getAddressDetail(),
                request.isDefault()
        );

        customerRepository.save(customer);
        log.info("배송지 추가: customerId={}", customerId);

        return customerMapper.toAddressResponse(address);
    }

    /**
     * 배송지 수정
     */
    @Transactional
    public AddressResponse updateAddress(Long customerId, Long addressId, AddressRequest request) {
        Customer customer = findCustomerById(customerId);

        Address address = customer.getAddresses().stream()
                .filter(addr -> addr.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("배송지를 찾을 수 없습니다."));

        address.update(
                request.getRecipientName(),
                request.getPhoneNumber(),
                request.getPostalCode(),
                request.getAddress(),
                request.getAddressDetail()
        );

        if (request.isDefault()) {
            customer.setDefaultAddress(addressId);
        }

        log.info("배송지 수정: customerId={}, addressId={}", customerId, addressId);
        return customerMapper.toAddressResponse(address);
    }

    /**
     * 배송지 삭제
     */
    @Transactional
    public void deleteAddress(Long customerId, Long addressId) {
        Customer customer = findCustomerById(customerId);
        customer.removeAddress(addressId);
        log.info("배송지 삭제: customerId={}, addressId={}", customerId, addressId);
    }

    /**
     * 기본 배송지 설정
     */
    @Transactional
    public void setDefaultAddress(Long customerId, Long addressId) {
        Customer customer = findCustomerById(customerId);
        customer.setDefaultAddress(addressId);
        log.info("기본 배송지 설정: customerId={}, addressId={}", customerId, addressId);
    }

    /**
     * 회원탈퇴
     */
    @Transactional
    public void withdraw(Long customerId, WithdrawRequest request) {
        Customer customer = findCustomerById(customerId);
        customer.withdraw(request.getReason());

        domainEventPublisher.publishEvents(customer);
        log.info("회원탈퇴 완료: {}", customer.getEmail());
    }

    private Customer findCustomerById(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException(customerId));
    }
}

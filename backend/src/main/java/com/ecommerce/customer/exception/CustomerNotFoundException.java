package com.ecommerce.customer.exception;

import com.ecommerce.shared.exception.ResourceNotFoundException;

/**
 * 고객을 찾을 수 없을 때 발생하는 예외
 */
public class CustomerNotFoundException extends ResourceNotFoundException {

    public CustomerNotFoundException(Long id) {
        super("고객을 찾을 수 없습니다. ID: " + id);
    }

    public CustomerNotFoundException(String email) {
        super("고객을 찾을 수 없습니다. 이메일: " + email);
    }
}

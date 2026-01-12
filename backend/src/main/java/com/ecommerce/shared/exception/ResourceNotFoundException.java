package com.ecommerce.shared.exception;

/**
 * 리소스를 찾을 수 없을 때 발생하는 예외
 */
public class ResourceNotFoundException extends BusinessException {

    private static final String ERROR_CODE = "RESOURCE_NOT_FOUND";

    public ResourceNotFoundException(String resourceType, Long id) {
        super(ERROR_CODE, String.format("%s with id %d not found", resourceType, id));
    }

    public ResourceNotFoundException(String resourceType, String identifier) {
        super(ERROR_CODE, String.format("%s with identifier '%s' not found", resourceType, identifier));
    }

    public ResourceNotFoundException(String message) {
        super(ERROR_CODE, message);
    }
}

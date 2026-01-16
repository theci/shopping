package com.ecommerce.review.domain;

/**
 * 리뷰 상태 Enum
 */
public enum ReviewStatus {

    ACTIVE("활성"),
    HIDDEN("숨김"),
    REPORTED("신고됨"),
    DELETED("삭제됨");

    private final String description;

    ReviewStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public boolean isVisible() {
        return this == ACTIVE;
    }

    public boolean canEdit() {
        return this == ACTIVE;
    }

    public boolean canDelete() {
        return this == ACTIVE || this == HIDDEN || this == REPORTED;
    }
}

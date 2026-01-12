package com.ecommerce.product.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Category 도메인 테스트")
class CategoryTest {

    @Test
    @DisplayName("카테고리를 생성할 수 있다")
    void createCategory() {
        // given
        String name = "전자제품";
        Integer displayOrder = 1;

        // when
        Category category = Category.create(name, null, displayOrder);

        // then
        assertThat(category.getName()).isEqualTo(name);
        assertThat(category.getDisplayOrder()).isEqualTo(displayOrder);
        assertThat(category.getParent()).isNull();
    }

    @Test
    @DisplayName("하위 카테고리를 생성할 수 있다")
    void createChildCategory() {
        // given
        Category parent = Category.create("전자제품", null, 1);
        String childName = "스마트폰";

        // when
        Category child = Category.create(childName, parent, 1);

        // then
        assertThat(child.getName()).isEqualTo(childName);
        assertThat(child.getParent()).isEqualTo(parent);
    }

    @Test
    @DisplayName("카테고리 정보를 수정할 수 있다")
    void updateCategory() {
        // given
        Category category = Category.create("전자제품", null, 1);
        String newName = "가전제품";
        Integer newOrder = 2;

        // when
        category.update(newName, newOrder);

        // then
        assertThat(category.getName()).isEqualTo(newName);
        assertThat(category.getDisplayOrder()).isEqualTo(newOrder);
    }

    @Test
    @DisplayName("카테고리명이 없으면 예외가 발생한다")
    void createCategoryWithoutName() {
        // when & then
        assertThatThrownBy(() -> Category.create(null, null, 1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("카테고리명은 필수입니다");
    }
}

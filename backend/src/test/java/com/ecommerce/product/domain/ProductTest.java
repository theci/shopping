package com.ecommerce.product.domain;

import com.ecommerce.product.exception.InsufficientStockException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Product 도메인 테스트")
class ProductTest {

    @Test
    @DisplayName("상품을 생성할 수 있다")
    void createProduct() {
        // given
        String name = "테스트 상품";
        BigDecimal price = new BigDecimal("10000");
        Integer stock = 100;

        // when
        Product product = Product.create(name, "설명", price, stock, "브랜드", null);

        // then
        assertThat(product.getName()).isEqualTo(name);
        assertThat(product.getPrice()).isEqualByComparingTo(price);
        assertThat(product.getStockQuantity()).isEqualTo(stock);
        assertThat(product.getStatus()).isEqualTo(ProductStatus.DRAFT);
        assertThat(product.getDomainEvents()).hasSize(1);
    }

    @Test
    @DisplayName("상품을 발행할 수 있다")
    void publishProduct() {
        // given
        Product product = createTestProduct();

        // when
        product.publish();

        // then
        assertThat(product.getStatus()).isEqualTo(ProductStatus.ACTIVE);
        assertThat(product.getDomainEvents()).hasSize(2); // Created + Published
    }

    @Test
    @DisplayName("재고를 감소시킬 수 있다")
    void decreaseStock() {
        // given
        Product product = createTestProduct();
        int decreaseAmount = 10;

        // when
        product.decreaseStock(decreaseAmount);

        // then
        assertThat(product.getStockQuantity()).isEqualTo(90);
    }

    @Test
    @DisplayName("재고를 증가시킬 수 있다")
    void increaseStock() {
        // given
        Product product = createTestProduct();
        int increaseAmount = 50;

        // when
        product.increaseStock(increaseAmount);

        // then
        assertThat(product.getStockQuantity()).isEqualTo(150);
    }

    @Test
    @DisplayName("재고가 부족하면 예외가 발생한다")
    void decreaseStockWithInsufficientStock() {
        // given
        Product product = createTestProduct();

        // when & then
        assertThatThrownBy(() -> product.decreaseStock(150))
                .isInstanceOf(InsufficientStockException.class);
    }

    @Test
    @DisplayName("재고가 0이 되면 품절 상태로 변경된다")
    void changeToOutOfStockWhenStockIsZero() {
        // given
        Product product = createTestProduct();

        // when
        product.decreaseStock(100);

        // then
        assertThat(product.getStockQuantity()).isEqualTo(0);
        assertThat(product.getStatus()).isEqualTo(ProductStatus.OUT_OF_STOCK);
    }

    @Test
    @DisplayName("가격을 변경할 수 있다")
    void updatePrice() {
        // given
        Product product = createTestProduct();
        BigDecimal newPrice = new BigDecimal("15000");

        // when
        product.updatePrice(newPrice);

        // then
        assertThat(product.getPrice()).isEqualByComparingTo(newPrice);
    }

    @Test
    @DisplayName("판매 가능 여부를 확인할 수 있다")
    void isAvailable() {
        // given
        Product product = createTestProduct();
        product.publish();

        // when & then
        assertThat(product.isAvailable()).isTrue();
    }

    @Test
    @DisplayName("품절 상태에서는 판매 불가능하다")
    void isNotAvailableWhenOutOfStock() {
        // given
        Product product = createTestProduct();
        product.publish();
        product.decreaseStock(100);

        // when & then
        assertThat(product.isAvailable()).isFalse();
    }

    private Product createTestProduct() {
        return Product.create(
                "테스트 상품",
                "테스트 설명",
                new BigDecimal("10000"),
                100,
                "테스트 브랜드",
                null
        );
    }
}

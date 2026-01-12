package com.ecommerce.product.infrastructure.persistence;

import com.ecommerce.product.domain.Product;
import com.ecommerce.product.domain.ProductStatus;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.ecommerce.product.domain.QProduct.product;
import static com.ecommerce.product.domain.QCategory.category;

/**
 * Product QueryDSL 전용 Repository
 * 복잡한 동적 쿼리를 처리
 */
@Repository
@RequiredArgsConstructor
public class ProductQuerydslRepository {

    private final JPAQueryFactory queryFactory;

    /**
     * 동적 검색 쿼리
     * 상태, 카테고리, 키워드를 조합한 검색
     */
    public Page<Product> searchProducts(ProductStatus status, Long categoryId, String keyword, Pageable pageable) {
        List<Product> products = queryFactory
                .selectFrom(product)
                .leftJoin(product.category, category).fetchJoin()
                .where(
                        statusEq(status),
                        categoryIdEq(categoryId),
                        keywordContains(keyword)
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(product.createdAt.desc())
                .fetch();

        Long total = queryFactory
                .select(product.count())
                .from(product)
                .where(
                        statusEq(status),
                        categoryIdEq(categoryId),
                        keywordContains(keyword)
                )
                .fetchOne();

        return new PageImpl<>(products, pageable, total != null ? total : 0L);
    }

    /**
     * 상품 상세 조회 (연관 엔티티 fetch join)
     */
    public Product findByIdWithDetails(Long productId) {
        return queryFactory
                .selectFrom(product)
                .leftJoin(product.category, category).fetchJoin()
                .leftJoin(product.images).fetchJoin()
                .leftJoin(product.options).fetchJoin()
                .where(product.id.eq(productId))
                .fetchOne();
    }

    /**
     * 카테고리별 상품 개수 조회
     */
    public Long countByCategory(Long categoryId) {
        return queryFactory
                .select(product.count())
                .from(product)
                .where(categoryIdEq(categoryId))
                .fetchOne();
    }

    /**
     * 재고 부족 상품 조회
     */
    public List<Product> findLowStockProducts(int threshold) {
        return queryFactory
                .selectFrom(product)
                .where(
                        product.stockQuantity.loe(threshold),
                        product.status.eq(ProductStatus.ACTIVE)
                )
                .fetch();
    }

    // === Dynamic Query Conditions ===

    private BooleanExpression statusEq(ProductStatus status) {
        return status != null ? product.status.eq(status) : null;
    }

    private BooleanExpression categoryIdEq(Long categoryId) {
        return categoryId != null ? product.category.id.eq(categoryId) : null;
    }

    private BooleanExpression keywordContains(String keyword) {
        return keyword != null && !keyword.isBlank()
                ? product.name.containsIgnoreCase(keyword)
                : null;
    }
}

package com.ecommerce.product.infrastructure.persistence;

import com.ecommerce.product.domain.Category;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.ecommerce.product.domain.QCategory.category;

/**
 * Category QueryDSL 전용 Repository
 * 복잡한 계층 구조 쿼리를 처리
 */
@Repository
@RequiredArgsConstructor
public class CategoryQuerydslRepository {

    private final JPAQueryFactory queryFactory;

    /**
     * 카테고리 트리 조회 (부모와 자식 모두 fetch)
     */
    public List<Category> findCategoryTree() {
        return queryFactory
                .selectFrom(category)
                .leftJoin(category.parent).fetchJoin()
                .orderBy(category.displayOrder.asc().nullsLast())
                .fetch();
    }

    /**
     * 특정 깊이까지의 카테고리 조회
     */
    public List<Category> findByDepth(int depth) {
        // 최상위 카테고리 (depth = 0)
        if (depth == 0) {
            return queryFactory
                    .selectFrom(category)
                    .where(category.parent.isNull())
                    .orderBy(category.displayOrder.asc().nullsLast())
                    .fetch();
        }

        // 추후 확장 가능: 특정 깊이까지 재귀 조회
        return queryFactory
                .selectFrom(category)
                .orderBy(category.displayOrder.asc().nullsLast())
                .fetch();
    }

    /**
     * 카테고리명으로 검색
     */
    public List<Category> searchByName(String keyword) {
        return queryFactory
                .selectFrom(category)
                .where(category.name.containsIgnoreCase(keyword))
                .orderBy(category.displayOrder.asc().nullsLast())
                .fetch();
    }

    /**
     * 부모 카테고리와 그 하위 카테고리 모두 조회
     */
    public List<Category> findWithChildren(Long parentId) {
        return queryFactory
                .selectFrom(category)
                .where(category.parent.id.eq(parentId))
                .orderBy(category.displayOrder.asc().nullsLast())
                .fetch();
    }
}

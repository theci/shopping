'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ProductList,
  CategoryNav,
  SearchBar,
  SearchFilters,
  useProducts,
  useCategories,
} from '@/features/product';
import { Pagination } from '@/shared/components/ui';
import type { ProductFilters } from '@/features/product';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ProductFilters>(() => ({
    keyword: searchParams.get('keyword') || undefined,
    categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sort: searchParams.get('sort') || 'createdAt',
    direction: (searchParams.get('direction') as 'ASC' | 'DESC') || 'DESC',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    size: 20,
  }));

  const { data: productsData, isLoading, error } = useProducts(filters);
  const { data: categories } = useCategories();

  // URL 동기화
  const updateUrl = useCallback((newFilters: ProductFilters) => {
    const params = new URLSearchParams();

    if (newFilters.keyword) params.set('keyword', newFilters.keyword);
    if (newFilters.categoryId) params.set('categoryId', newFilters.categoryId.toString());
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.sort && newFilters.sort !== 'createdAt') params.set('sort', newFilters.sort);
    if (newFilters.direction && newFilters.direction !== 'DESC') params.set('direction', newFilters.direction);
    if (newFilters.page && newFilters.page > 0) params.set('page', newFilters.page.toString());

    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [router]);

  const handleFilterChange = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
    updateUrl(newFilters);
  }, [updateUrl]);

  const handlePageChange = useCallback((page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateUrl(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, updateUrl]);

  const handleSearch = useCallback((keyword: string) => {
    const newFilters = { ...filters, keyword: keyword || undefined, page: 0 };
    setFilters(newFilters);
    updateUrl(newFilters);
  }, [filters, updateUrl]);

  const handleCategorySelect = useCallback((categoryId: number | undefined) => {
    const newFilters = { ...filters, categoryId, page: 0 };
    setFilters(newFilters);
    updateUrl(newFilters);
  }, [filters, updateUrl]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 사이드바: 카테고리 & 필터 */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <CategoryNav
              categories={categories || []}
              selectedCategoryId={filters.categoryId}
              onCategorySelect={handleCategorySelect}
            />
            <SearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* 메인: 상품 목록 */}
        <main className="flex-1 min-w-0">
          {/* 검색바 */}
          <div className="mb-6">
            <SearchBar
              initialKeyword={filters.keyword}
              onSearch={handleSearch}
            />
          </div>

          {/* 상품 수 & 정렬 */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              {productsData?.totalElements !== undefined && (
                <>
                  총 <span className="font-medium text-gray-900">{productsData.totalElements.toLocaleString()}</span>개 상품
                </>
              )}
            </p>

            {/* 모바일 필터 버튼 */}
            <div className="lg:hidden">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                필터
              </button>
            </div>
          </div>

          {/* 활성 필터 표시 */}
          {(filters.keyword || filters.categoryId || filters.minPrice || filters.maxPrice) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.keyword && (
                <FilterTag
                  label={`검색: ${filters.keyword}`}
                  onRemove={() => handleFilterChange({ ...filters, keyword: undefined, page: 0 })}
                />
              )}
              {filters.categoryId && categories && (
                <FilterTag
                  label={`카테고리: ${findCategoryName(categories, filters.categoryId)}`}
                  onRemove={() => handleFilterChange({ ...filters, categoryId: undefined, page: 0 })}
                />
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <FilterTag
                  label={`가격: ${filters.minPrice?.toLocaleString() || 0}원 ~ ${filters.maxPrice?.toLocaleString() || ''}원`}
                  onRemove={() => handleFilterChange({ ...filters, minPrice: undefined, maxPrice: undefined, page: 0 })}
                />
              )}
              <button
                onClick={() => handleFilterChange({
                  sort: 'createdAt',
                  direction: 'DESC',
                  page: 0,
                  size: 20,
                })}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                전체 초기화
              </button>
            </div>
          )}

          {/* 상품 목록 */}
          <ProductList
            products={productsData?.content || []}
            isLoading={isLoading}
            error={error as Error | null}
            emptyMessage={filters.keyword ? `"${filters.keyword}"에 대한 검색 결과가 없습니다.` : '상품이 없습니다.'}
          />

          {/* 페이지네이션 */}
          {productsData && productsData.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={productsData.pageNumber}
                totalPages={productsData.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}

function findCategoryName(categories: Array<{ id: number; name: string; children?: Array<{ id: number; name: string }> }>, id: number): string {
  for (const category of categories) {
    if (category.id === id) return category.name;
    if (category.children) {
      const found = findCategoryName(category.children, id);
      if (found) return found;
    }
  }
  return '';
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

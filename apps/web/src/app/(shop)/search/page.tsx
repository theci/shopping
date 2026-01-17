'use client';

import { useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import {
  ProductList,
  SearchFilters,
  useProductSearch,
} from '@/features/product';
import { Pagination, Input, Button } from '@/shared/components/ui';
import type { ProductFilters } from '@/features/product';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(keyword);
  const [filters, setFilters] = useState<ProductFilters>(() => ({
    keyword: keyword || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sort: searchParams.get('sort') || 'createdAt',
    direction: (searchParams.get('direction') as 'ASC' | 'DESC') || 'DESC',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    size: 20,
  }));

  const { data: searchResults, isLoading, error } = useProductSearch({
    ...filters,
    keyword: keyword || undefined,
  });

  const updateUrl = useCallback((newKeyword: string, newFilters: Partial<ProductFilters>) => {
    const params = new URLSearchParams();

    if (newKeyword) params.set('q', newKeyword);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.sort && newFilters.sort !== 'createdAt') params.set('sort', newFilters.sort);
    if (newFilters.direction && newFilters.direction !== 'DESC') params.set('direction', newFilters.direction);
    if (newFilters.page && newFilters.page > 0) params.set('page', newFilters.page.toString());

    router.push(`/search?${params.toString()}`, { scroll: false });
  }, [router]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKeyword = searchInput.trim();
    if (trimmedKeyword) {
      const newFilters = { ...filters, page: 0 };
      setFilters(newFilters);
      updateUrl(trimmedKeyword, newFilters);
    }
  }, [searchInput, filters, updateUrl]);

  const handleFilterChange = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
    updateUrl(keyword, newFilters);
  }, [keyword, updateUrl]);

  const handlePageChange = useCallback((page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateUrl(keyword, newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, keyword, updateUrl]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 브레드크럼 */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">홈</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">검색</span>
        {keyword && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 truncate max-w-[200px]">&quot;{keyword}&quot;</span>
          </>
        )}
      </nav>

      {/* 검색바 */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="pl-10"
            />
          </div>
          <Button type="submit">검색</Button>
        </div>
      </form>

      {/* 검색어가 없을 때 */}
      {!keyword && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">검색어를 입력해주세요</h2>
          <p className="text-gray-500">원하는 상품을 검색해보세요</p>
        </div>
      )}

      {/* 검색 결과 */}
      {keyword && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 사이드바: 필터 */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24">
              <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* 메인: 검색 결과 */}
          <main className="flex-1 min-w-0">
            {/* 검색 결과 수 */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                {searchResults?.totalElements !== undefined && (
                  <>
                    <span className="font-medium text-gray-900">&quot;{keyword}&quot;</span>
                    에 대한 검색 결과{' '}
                    <span className="font-medium text-gray-900">{searchResults.totalElements.toLocaleString()}</span>
                    개
                  </>
                )}
              </p>
            </div>

            {/* 상품 목록 */}
            <ProductList
              products={searchResults?.content || []}
              isLoading={isLoading}
              error={error as Error | null}
              emptyMessage={`"${keyword}"에 대한 검색 결과가 없습니다.`}
            />

            {/* 페이지네이션 */}
            {searchResults && searchResults.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={searchResults.pageNumber}
                  totalPages={searchResults.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* 검색 결과 없음 추가 안내 */}
            {searchResults && searchResults.content.length === 0 && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">검색 팁</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>- 검색어의 철자가 정확한지 확인해주세요</li>
                  <li>- 검색어를 줄이거나 다른 단어로 검색해보세요</li>
                  <li>- 일반적인 검색어로 검색해보세요</li>
                </ul>
                <div className="mt-4">
                  <Link href="/products">
                    <Button variant="outline" size="sm">전체 상품 보기</Button>
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 bg-gray-200 rounded w-64 mb-8 animate-pulse" />
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
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

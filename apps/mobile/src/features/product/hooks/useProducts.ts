/**
 * Product Hooks
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productApi, ProductSearchParams } from '../api/productApi';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductSearchParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  categories: () => ['categories'] as const,
};

/**
 * 상품 목록 조회
 */
export function useProducts(params: ProductSearchParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getProducts(params),
  });
}

/**
 * 상품 상세 조회
 */
export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProduct(id),
    enabled: !!id && id > 0,
  });
}

/**
 * 무한 스크롤 상품 목록
 */
export function useInfiniteProducts(params: Omit<ProductSearchParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', params],
    queryFn: ({ pageParam = 0 }) =>
      productApi.getProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
  });
}

/**
 * 추천 상품 조회
 */
export function useFeaturedProducts(size: number = 10) {
  return useQuery({
    queryKey: [...productKeys.featured(), size],
    queryFn: () => productApi.getFeaturedProducts(size),
  });
}

/**
 * 카테고리 목록 조회
 */
export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: productApi.getCategories,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

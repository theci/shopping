import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import type { ProductFilters } from '../types';

/**
 * Product Query Keys
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: Partial<ProductFilters>) => [...productKeys.lists(), params] as const,
  search: (params: Partial<ProductFilters>) => [...productKeys.all, 'search', params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

/**
 * 상품 목록 조회 훅
 */
export const useProducts = (params: Partial<ProductFilters>) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

/**
 * 상품 검색 훅
 */
export const useProductSearch = (params: Partial<ProductFilters>) => {
  return useQuery({
    queryKey: productKeys.search(params),
    queryFn: () => productApi.searchProducts(params),
    staleTime: 1000 * 60 * 5,
    enabled: !!params.keyword && params.keyword.length >= 2,
  });
};

/**
 * 무한 스크롤 상품 목록 훅
 */
export const useInfiniteProducts = (params: Omit<Partial<ProductFilters>, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', params],
    queryFn: ({ pageParam = 0 }) =>
      productApi.getProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.pageNumber + 1;
    },
    initialPageParam: 0,
  });
};

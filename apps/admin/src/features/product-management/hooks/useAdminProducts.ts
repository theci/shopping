/**
 * 상품 목록 조회 Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { productManagementApi } from '../api/productManagementApi';
import type { ProductSearchParams } from '../types';

export const productKeys = {
  all: ['admin-products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: ProductSearchParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
};

/**
 * 상품 목록 조회
 */
export const useAdminProducts = (params?: ProductSearchParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productManagementApi.getProducts(params),
    staleTime: 1000 * 60, // 1분
  });
};

/**
 * 상품 상세 조회
 */
export const useAdminProduct = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productManagementApi.getProduct(id),
    enabled: !!id,
  });
};

/**
 * 카테고리 목록 조회
 */
export const useCategories = () => {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: () => productManagementApi.getCategories(),
    staleTime: 1000 * 60 * 10, // 10분
  });
};

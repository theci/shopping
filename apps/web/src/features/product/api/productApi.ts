import { api } from '@/lib/api/client';
import type { ApiResponse, PageResponse } from '@/lib/api/types';
import type { ProductListItem, ProductDetail, ProductFilters, Category } from '../types';

/**
 * Product API
 */
export const productApi = {
  /**
   * 상품 목록 조회 (페이징)
   */
  getProducts: async (params: Partial<ProductFilters>): Promise<PageResponse<ProductListItem>> => {
    const response = await api.get<ApiResponse<PageResponse<ProductListItem>>>('/v1/products', {
      page: params.page ?? 0,
      size: params.size ?? 20,
      keyword: params.keyword,
      categoryId: params.categoryId,
      brand: params.brand,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      status: params.status,
      sort: params.sort,
      direction: params.direction,
    });
    return response.data;
  },

  /**
   * 상품 검색
   */
  searchProducts: async (params: Partial<ProductFilters>): Promise<PageResponse<ProductListItem>> => {
    const response = await api.get<ApiResponse<PageResponse<ProductListItem>>>('/v1/products/search', {
      page: params.page ?? 0,
      size: params.size ?? 20,
      keyword: params.keyword,
      categoryId: params.categoryId,
      brand: params.brand,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      sort: params.sort,
      direction: params.direction,
    });
    return response.data;
  },

  /**
   * 상품 상세 조회
   */
  getProduct: async (id: number): Promise<ProductDetail> => {
    const response = await api.get<ApiResponse<ProductDetail>>(`/v1/products/${id}`);
    return response.data;
  },

  /**
   * 카테고리 목록 조회
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>('/v1/categories');
    return response.data;
  },

  /**
   * 카테고리별 상품 조회
   */
  getProductsByCategory: async (
    categoryId: number,
    params: Partial<ProductFilters>
  ): Promise<PageResponse<ProductListItem>> => {
    return productApi.getProducts({ ...params, categoryId });
  },
};

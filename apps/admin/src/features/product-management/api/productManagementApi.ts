/**
 * Product Management API
 */

import { api } from '@/lib/api/client';
import type {
  Product,
  ProductListItem,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductSearchParams,
  StockUpdateRequest,
  Category,
  ApiResponse,
  PageResponse,
} from '../types';

export const productManagementApi = {
  /**
   * 상품 목록 조회
   */
  getProducts: async (params?: ProductSearchParams): Promise<PageResponse<ProductListItem>> => {
    const response = await api.get<ApiResponse<PageResponse<ProductListItem>>>(
      '/api/v1/admin/products',
      params
    );
    return response.data;
  },

  /**
   * 상품 상세 조회
   */
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/api/v1/admin/products/${id}`);
    return response.data;
  },

  /**
   * 상품 생성
   */
  createProduct: async (data: ProductCreateRequest): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/api/v1/admin/products', data);
    return response.data;
  },

  /**
   * 상품 수정
   */
  updateProduct: async (id: number, data: ProductUpdateRequest): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/api/v1/admin/products/${id}`, data);
    return response.data;
  },

  /**
   * 상품 삭제
   */
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/admin/products/${id}`);
  },

  /**
   * 상품 상태 변경
   */
  updateProductStatus: async (id: number, status: string): Promise<Product> => {
    const response = await api.patch<ApiResponse<Product>>(
      `/api/v1/admin/products/${id}/status`,
      { status }
    );
    return response.data;
  },

  /**
   * 재고 수정
   */
  updateStock: async (id: number, data: StockUpdateRequest): Promise<Product> => {
    const response = await api.patch<ApiResponse<Product>>(
      `/api/v1/admin/products/${id}/stock`,
      data
    );
    return response.data;
  },

  /**
   * 카테고리 목록 조회
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>('/api/v1/admin/categories');
    return response.data;
  },
};

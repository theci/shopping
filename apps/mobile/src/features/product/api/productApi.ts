/**
 * Product API
 */

import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PageResponse } from '@/lib/api/types';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  stockQuantity: number;
  category?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductSearchParams {
  page?: number;
  size?: number;
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  children?: Category[];
}

export const productApi = {
  /**
   * 상품 목록 조회
   */
  getProducts: async (params: ProductSearchParams = {}): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(
      '/api/v1/products',
      { params }
    );
    return (response as any).data || response;
  },

  /**
   * 상품 상세 조회
   */
  getProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/api/v1/products/${id}`);
    return (response as any).data || response;
  },

  /**
   * 카테고리 목록 조회
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/api/v1/categories');
    return (response as any).data || response;
  },

  /**
   * 추천 상품 조회
   */
  getFeaturedProducts: async (size: number = 10): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Product>>>(
      '/api/v1/products',
      { params: { size, sortBy: 'createdAt', sortDir: 'desc', status: 'ACTIVE' } }
    );
    const data = (response as any).data || response;
    return data.content || [];
  },
};

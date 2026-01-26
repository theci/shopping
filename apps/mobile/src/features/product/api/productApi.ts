/**
 * Product API - 백엔드와 일치하는 타입
 */

import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PageResponse } from '@/lib/api/types';

/**
 * 상품 상태
 */
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

/**
 * 상품 카테고리 (중첩 응답)
 */
export interface ProductCategory {
  id: number;
  name: string;
}

/**
 * 상품 이미지
 */
export interface ProductImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

/**
 * 상품 응답 (백엔드 ProductResponse와 일치)
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  discountRate?: number;
  stockQuantity: number;
  status: ProductStatus;
  brand?: string;
  viewCount?: number;
  salesCount?: number;
  category?: ProductCategory;
  images?: ProductImage[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/**
 * 상품 검색 파라미터
 */
export interface ProductSearchParams {
  page?: number;
  size?: number;
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

/**
 * 카테고리 응답
 */
export interface Category {
  id: number;
  name: string;
  parentId?: number;
  displayOrder?: number;
  children?: Category[];
  createdAt?: string;
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
      { params: { size, sort: 'createdAt', direction: 'DESC', status: 'ACTIVE' } }
    );
    const data = (response as any).data || response;
    return data.content || [];
  },
};

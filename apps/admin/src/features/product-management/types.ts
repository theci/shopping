/**
 * Product Management Types
 */

export type { ApiResponse, PageResponse } from '@/lib/api/types';

/**
 * 상품 상태
 */
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

/**
 * 카테고리
 */
export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  children?: Category[];
}

/**
 * 상품 목록 아이템
 */
export interface ProductListItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  status: ProductStatus;
  categoryId?: number;
  categoryName?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 상품 상세
 */
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  status: ProductStatus;
  categoryId?: number;
  categoryName?: string;
  imageUrl?: string;
  images?: string[];
  createdAt: string;
  updatedAt?: string;
}

/**
 * 상품 생성 요청
 */
export interface ProductCreateRequest {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  status?: ProductStatus;
  categoryId?: number;
  imageUrl?: string;
  images?: string[];
}

/**
 * 상품 수정 요청
 */
export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  stockQuantity?: number;
  status?: ProductStatus;
  categoryId?: number;
  imageUrl?: string;
  images?: string[];
}

/**
 * 상품 검색 파라미터
 */
export interface ProductSearchParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: ProductStatus;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

/**
 * 재고 수정 요청
 */
export interface StockUpdateRequest {
  stockQuantity: number;
}

/**
 * 상품 상태 정보
 */
export const PRODUCT_STATUS_MAP: Record<ProductStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  DRAFT: { label: '임시저장', variant: 'default' },
  ACTIVE: { label: '판매중', variant: 'success' },
  INACTIVE: { label: '판매중지', variant: 'warning' },
  OUT_OF_STOCK: { label: '품절', variant: 'danger' },
};

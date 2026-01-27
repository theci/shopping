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
  parentId?: number;
  displayOrder?: number;
  children?: Category[];
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
 * 상품 옵션
 */
export interface ProductOption {
  id: number;
  optionName: string;
  optionValue: string;
  additionalPrice: number;
}

/**
 * 상품 목록 아이템 (백엔드 응답에 맞춤)
 */
export interface ProductListItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  discountRate?: number;
  stockQuantity: number;
  status: ProductStatus;
  brand?: string;
  viewCount?: number;
  salesCount?: number;
  category?: Category;
  images?: ProductImage[];
  options?: ProductOption[];
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

/**
 * 상품 상세
 */
export interface Product extends ProductListItem {}

/**
 * 상품 생성 요청
 */
export interface ProductCreateRequest {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  status?: ProductStatus;
  categoryId?: number;
  brand?: string;
  images?: { imageUrl: string; displayOrder: number }[];
}

/**
 * 상품 수정 요청
 */
export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  stockQuantity?: number;
  status?: ProductStatus;
  categoryId?: number;
  brand?: string;
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

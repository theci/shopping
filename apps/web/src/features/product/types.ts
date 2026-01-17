/**
 * Product Feature Types
 * Re-export shared types and add feature-specific types
 */

export type {
  Product,
  ProductImage,
  ProductStatus,
  Category,
  ProductSearchParams,
} from '@/shared/types/product';

export type { ApiResponse, PageResponse } from '@/shared/types/api';

/**
 * 상품 상세 (확장)
 */
export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  discountRate?: number;
  stockQuantity: number;
  status: string;
  brand?: string;
  viewCount: number;
  salesCount: number;
  category?: {
    id: number;
    name: string;
  };
  images: Array<{
    id: number;
    imageUrl: string;
    displayOrder: number;
  }>;
  options: Array<{
    id: number;
    optionName: string;
    optionValue: string;
    additionalPrice: number;
  }>;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * 상품 목록 아이템
 */
export interface ProductListItem {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  discountRate?: number;
  stockQuantity: number;
  status: string;
  brand?: string;
  viewCount: number;
  salesCount: number;
  category?: {
    id: number;
    name: string;
  };
  images: Array<{
    id: number;
    imageUrl: string;
    displayOrder: number;
  }>;
  createdAt: string;
}

/**
 * 검색 필터 상태
 */
export interface ProductFilters {
  keyword?: string;
  categoryId?: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sort: string;
  direction: 'ASC' | 'DESC';
  page: number;
  size: number;
}

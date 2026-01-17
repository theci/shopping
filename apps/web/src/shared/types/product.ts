/**
 * 상품 상태
 */
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

/**
 * 상품 정보
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  categoryId: number;
  categoryName?: string;
  brand?: string;
  imageUrl?: string;
  images?: ProductImage[];
  status: ProductStatus;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 상품 이미지
 */
export interface ProductImage {
  id: number;
  url: string;
  displayOrder: number;
  isMain: boolean;
}

/**
 * 카테고리
 */
export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  children?: Category[];
  productCount?: number;
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
  status?: ProductStatus;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

/**
 * 상품 관련 타입 - 백엔드 ProductResponse와 일치
 */

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
 * 상품 옵션
 */
export interface ProductOption {
  id: number;
  optionName: string;
  optionValue: string;
  additionalPrice: number;
}

/**
 * 상품 응답 (백엔드 ProductResponse)
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
  options?: ProductOption[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
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

/**
 * 상품 생성 요청
 */
export interface ProductCreateRequest {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  brand?: string;
  categoryId?: number;
}

/**
 * 상품 수정 요청
 */
export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  brand?: string;
  categoryId?: number;
}

/**
 * 상품 검색 요청
 */
export interface ProductSearchRequest {
  keyword?: string;
  status?: ProductStatus;
  categoryId?: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

/**
 * 재고 조정 타입
 */
export type StockAdjustmentType = 'INCREASE' | 'DECREASE';

/**
 * 재고 조정 요청
 */
export interface StockAdjustmentRequest {
  quantity: number;
  type: StockAdjustmentType;
}

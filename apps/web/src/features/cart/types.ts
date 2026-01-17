/**
 * Cart Feature Types
 */

export type { ApiResponse } from '@/lib/api/types';

/**
 * 장바구니 아이템
 */
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  selected: boolean;
}

/**
 * 장바구니
 */
export interface Cart {
  id: number;
  customerId: number;
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 장바구니 아이템 추가 요청
 */
export interface CartItemRequest {
  productId: number;
  quantity: number;
}

/**
 * 장바구니 아이템 수량 변경 요청
 */
export interface UpdateCartItemRequest {
  quantity: number;
}

/**
 * 로컬 장바구니 아이템 (비로그인용)
 */
export interface LocalCartItem {
  productId: number;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  selected: boolean;
  addedAt: string;
}

/**
 * 로컬 장바구니 (비로그인용)
 */
export interface LocalCart {
  items: LocalCartItem[];
  updatedAt: string;
}

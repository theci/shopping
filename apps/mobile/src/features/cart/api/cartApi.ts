/**
 * Cart API - 백엔드와 일치하는 타입
 */

import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';

/**
 * 장바구니 아이템 응답 (백엔드 CartItemResponse와 일치)
 */
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt: string;
}

/**
 * 장바구니 응답 (백엔드 CartResponse와 일치)
 */
export interface Cart {
  id: number;
  customerId: number;
  items: CartItem[];
  itemCount: number;
  totalQuantity: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 장바구니 아이템 추가 요청
 */
export interface AddToCartRequest {
  productId: number;
  quantity?: number;
}

/**
 * 장바구니 아이템 수량 변경 요청
 */
export interface UpdateCartItemRequest {
  quantity: number;
}

export const cartApi = {
  /**
   * 장바구니 조회
   */
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/api/v1/carts/me');
    return (response as any).data || response;
  },

  /**
   * 장바구니에 상품 추가
   */
  addToCart: async (data: AddToCartRequest): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>('/api/v1/carts/items', data);
    return (response as any).data || response;
  },

  /**
   * 장바구니 상품 수량 변경
   */
  updateCartItem: async (itemId: number, data: UpdateCartItemRequest): Promise<Cart> => {
    const response = await apiClient.put<ApiResponse<Cart>>(
      `/api/v1/carts/items/${itemId}`,
      data
    );
    return (response as any).data || response;
  },

  /**
   * 장바구니 상품 삭제
   */
  removeCartItem: async (itemId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/carts/items/${itemId}`);
  },

  /**
   * 장바구니 비우기
   */
  clearCart: async (): Promise<void> => {
    await apiClient.delete('/api/v1/carts/me');
  },
};

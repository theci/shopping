/**
 * Cart API
 */

import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  status: string;
}

export interface Cart {
  id: number;
  customerId: number;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export const cartApi = {
  /**
   * 장바구니 조회
   */
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/api/v1/cart');
    return (response as any).data || response;
  },

  /**
   * 장바구니에 상품 추가
   */
  addToCart: async (data: AddToCartRequest): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>('/api/v1/cart/items', data);
    return (response as any).data || response;
  },

  /**
   * 장바구니 상품 수량 변경
   */
  updateCartItem: async (itemId: number, data: UpdateCartItemRequest): Promise<Cart> => {
    const response = await apiClient.patch<ApiResponse<Cart>>(
      `/api/v1/cart/items/${itemId}`,
      data
    );
    return (response as any).data || response;
  },

  /**
   * 장바구니 상품 삭제
   */
  removeCartItem: async (itemId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/cart/items/${itemId}`);
  },

  /**
   * 장바구니 비우기
   */
  clearCart: async (): Promise<void> => {
    await apiClient.delete('/api/v1/cart');
  },
};

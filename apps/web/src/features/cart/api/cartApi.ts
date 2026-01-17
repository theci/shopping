import { api } from '@/lib/api/client';
import type { ApiResponse, Cart, CartItemRequest, UpdateCartItemRequest } from '../types';

/**
 * Cart API
 */
export const cartApi = {
  /**
   * 내 장바구니 조회
   */
  getCart: async (): Promise<Cart> => {
    const response = await api.get<ApiResponse<Cart>>('/v1/carts/me');
    return response.data;
  },

  /**
   * 장바구니에 상품 추가
   */
  addItem: async (data: CartItemRequest): Promise<Cart> => {
    const response = await api.post<ApiResponse<Cart>>('/v1/carts/items', data);
    return response.data;
  },

  /**
   * 수량 변경
   */
  updateItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const response = await api.put<ApiResponse<Cart>>(
      `/v1/carts/items/${itemId}`,
      { quantity } as UpdateCartItemRequest
    );
    return response.data;
  },

  /**
   * 상품 삭제
   */
  removeItem: async (itemId: number): Promise<void> => {
    await api.delete(`/v1/carts/items/${itemId}`);
  },

  /**
   * 선택 상품 삭제
   */
  removeSelectedItems: async (itemIds: number[]): Promise<void> => {
    await api.post('/v1/carts/items/delete', { itemIds });
  },

  /**
   * 장바구니 비우기
   */
  clearCart: async (): Promise<void> => {
    await api.delete('/v1/carts/me');
  },

  /**
   * 아이템 선택/해제
   */
  toggleItemSelection: async (itemId: number, selected: boolean): Promise<Cart> => {
    const response = await api.patch<ApiResponse<Cart>>(
      `/v1/carts/items/${itemId}/selection`,
      { selected }
    );
    return response.data;
  },

  /**
   * 전체 선택/해제
   */
  toggleAllSelection: async (selected: boolean): Promise<Cart> => {
    const response = await api.patch<ApiResponse<Cart>>(
      '/v1/carts/items/selection',
      { selected }
    );
    return response.data;
  },
};

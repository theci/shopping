/**
 * 장바구니 관련 타입 - 백엔드 CartResponse와 일치
 */

/**
 * 장바구니 아이템 응답
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
 * 장바구니 응답 (백엔드 CartResponse)
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
export interface CartItemRequest {
  productId: number;
  quantity?: number;
}

/**
 * 장바구니 아이템 수량 변경 요청
 */
export interface CartItemQuantityRequest {
  quantity: number;
}

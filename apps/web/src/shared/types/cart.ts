/**
 * 장바구니
 */
export interface Cart {
  id: number;
  customerId: number;
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}

/**
 * 장바구니 상품
 */
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  subtotal: number;
  stockQuantity: number;
  isAvailable: boolean;
}

/**
 * 장바구니 상품 추가 요청
 */
export interface CartItemRequest {
  productId: number;
  quantity: number;
}

/**
 * 장바구니 수량 변경 요청
 */
export interface CartItemUpdateRequest {
  quantity: number;
}

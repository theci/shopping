/**
 * 주문 상태
 */
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PAID'
  | 'PREPARING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

/**
 * 주문 정보
 */
export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  orderedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

/**
 * 주문 상품
 */
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

/**
 * 배송 주소
 */
export interface ShippingAddress {
  recipientName: string;
  phoneNumber: string;
  zipCode: string;
  address: string;
  addressDetail?: string;
}

/**
 * 주문 생성 요청
 */
export interface OrderCreateRequest {
  items: OrderItemRequest[];
  shippingAddress: ShippingAddress;
  couponId?: number;
  paymentMethod: string;
}

/**
 * 주문 상품 요청
 */
export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

/**
 * 주문 검색 파라미터
 */
export interface OrderSearchParams {
  page?: number;
  size?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}

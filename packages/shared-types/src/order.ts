/**
 * 주문 관련 타입 - 백엔드 OrderResponse와 일치
 */

/**
 * 주문 상태
 */
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RETURNED';

/**
 * 주문 상태 라벨
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: '주문 대기',
  CONFIRMED: '주문 확인',
  PREPARING: '상품 준비중',
  SHIPPED: '배송중',
  DELIVERED: '배송 완료',
  COMPLETED: '구매 확정',
  CANCELLED: '주문 취소',
  RETURNED: '반품',
};

/**
 * 주문 상품 응답
 */
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

/**
 * 주문 응답 (백엔드 OrderResponse)
 * 배송 정보는 플랫 필드로 제공됨
 */
export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: OrderStatus;
  orderStatusDescription: string;

  // 배송 정보 (플랫 필드)
  recipientName: string;
  recipientPhone: string;
  shippingPostalCode: string;
  shippingAddress: string;
  shippingAddressDetail?: string;
  shippingMemo?: string;

  // 결제 정보
  paymentId?: number;

  // 취소 정보
  cancelReason?: string;
  cancelledAt?: string;

  // 완료 정보
  completedAt?: string;

  itemCount: number;
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 주문 생성 요청
 */
export interface OrderCreateRequest {
  recipientName: string;
  recipientPhone: string;
  shippingPostalCode: string;
  shippingAddress: string;
  shippingAddressDetail?: string;
  shippingMemo?: string;
}

/**
 * 주문 검색 요청
 */
export interface OrderSearchRequest {
  status?: OrderStatus;
  page?: number;
  size?: number;
}

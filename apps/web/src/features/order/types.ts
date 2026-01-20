/**
 * Order Feature Types
 */

export type { ApiResponse, PageResponse } from '@/lib/api/types';

/**
 * 주문 상태
 */
export type OrderStatus =
  | 'PENDING'           // 주문 대기
  | 'PAID'              // 결제 완료
  | 'PREPARING'         // 상품 준비중
  | 'SHIPPED'           // 배송중
  | 'DELIVERED'         // 배송 완료
  | 'CONFIRMED'         // 구매 확정
  | 'CANCELLED'         // 주문 취소
  | 'REFUNDED';         // 환불 완료

/**
 * 결제 수단
 */
export type PaymentMethod = 'CARD' | 'BANK_TRANSFER' | 'VIRTUAL_ACCOUNT' | 'TOSS_PAY';

/**
 * 주문 상품
 */
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  optionName?: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

/**
 * 배송 정보
 */
export interface ShippingInfo {
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail?: string;
  memo?: string;
}

/**
 * 주문 정보
 */
export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  status: OrderStatus;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentMethod?: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 주문 생성 요청
 */
export interface OrderCreateRequest {
  items: {
    productId: number;
    quantity: number;
    optionId?: number;
  }[];
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  couponId?: number;
  memo?: string;
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

/**
 * 주문 취소 요청
 */
export interface OrderCancelRequest {
  reason?: string;
}

/**
 * 주문 상태 정보
 */
export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: '주문 대기', color: 'gray' },
  PAID: { label: '결제 완료', color: 'blue' },
  PREPARING: { label: '상품 준비중', color: 'yellow' },
  SHIPPED: { label: '배송중', color: 'purple' },
  DELIVERED: { label: '배송 완료', color: 'green' },
  CONFIRMED: { label: '구매 확정', color: 'green' },
  CANCELLED: { label: '주문 취소', color: 'red' },
  REFUNDED: { label: '환불 완료', color: 'red' },
};

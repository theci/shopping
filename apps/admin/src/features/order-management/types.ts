/**
 * Order Management Types
 */

export type { ApiResponse, PageResponse } from '@/lib/api/types';

/**
 * 주문 상태
 */
export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'RETURNED';

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
 * 고객 정보 (주문 내)
 */
export interface OrderCustomer {
  id: number;
  email: string;
  name: string;
  phone?: string;
}

/**
 * 주문 목록 아이템
 */
export interface OrderListItem {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  paymentMethod?: PaymentMethod;
  createdAt: string;
}

/**
 * 주문 상세
 */
export interface Order {
  id: number;
  orderNumber: string;
  customer: OrderCustomer;
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
  trackingNumber?: string;
  trackingCompany?: string;
  adminMemo?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 주문 검색 파라미터
 */
export interface OrderSearchParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

/**
 * 주문 상태 변경 요청
 */
export interface OrderStatusUpdateRequest {
  status: OrderStatus;
  reason?: string;
}

/**
 * 배송 정보 입력 요청
 */
export interface ShippingUpdateRequest {
  trackingNumber: string;
  trackingCompany: string;
}

/**
 * 관리자 메모 요청
 */
export interface AdminMemoRequest {
  memo: string;
}

/**
 * 주문 상태 정보
 */
export const ORDER_STATUS_MAP: Record<
  OrderStatus,
  { label: string; variant: 'default' | 'info' | 'warning' | 'success' | 'danger' }
> = {
  PENDING: { label: '주문 대기', variant: 'default' },
  PAID: { label: '결제 완료', variant: 'info' },
  CONFIRMED: { label: '주문 확인', variant: 'info' },
  PREPARING: { label: '상품 준비중', variant: 'warning' },
  SHIPPED: { label: '배송중', variant: 'info' },
  DELIVERED: { label: '배송 완료', variant: 'success' },
  COMPLETED: { label: '구매 확정', variant: 'success' },
  CANCELLED: { label: '주문 취소', variant: 'danger' },
  REFUNDED: { label: '환불 완료', variant: 'danger' },
  RETURNED: { label: '반품', variant: 'danger' },
};

/**
 * 결제 수단 정보
 */
export const PAYMENT_METHOD_MAP: Record<PaymentMethod, string> = {
  CARD: '신용카드',
  BANK_TRANSFER: '계좌이체',
  VIRTUAL_ACCOUNT: '가상계좌',
  TOSS_PAY: '토스페이',
};

/**
 * 배송사 목록
 */
export const SHIPPING_COMPANIES = [
  { value: 'CJ', label: 'CJ대한통운' },
  { value: 'HANJIN', label: '한진택배' },
  { value: 'LOTTE', label: '롯데택배' },
  { value: 'LOGEN', label: '로젠택배' },
  { value: 'POST', label: '우체국택배' },
  { value: 'GS', label: 'GS편의점택배' },
  { value: 'CU', label: 'CU편의점택배' },
];

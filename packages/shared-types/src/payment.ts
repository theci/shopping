/**
 * 결제 관련 타입 - 백엔드 PaymentResponse와 일치
 */

/**
 * 결제 방법
 */
export type PaymentMethod = 'CARD' | 'BANK_TRANSFER' | 'VIRTUAL_ACCOUNT' | 'MOBILE';

/**
 * 결제 상태
 */
export type PaymentStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

/**
 * 결제 응답
 */
export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentMethodDescription: string;
  paymentStatus: PaymentStatus;
  paymentStatusDescription: string;
  transactionId?: string;
  pgProvider?: string;
  paymentKey?: string;
  failedReason?: string;
  refundAmount?: number;
  refundableAmount?: number;
  refundReason?: string;
  refundedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 결제 요청
 */
export interface PaymentRequest {
  orderId: number;
  paymentMethod: PaymentMethod;
  successUrl?: string;
  failUrl?: string;
}

/**
 * 결제 초기화 응답
 */
export interface PaymentInitResponse {
  paymentId: number;
  paymentKey: string;
  clientKey?: string;
  checkoutUrl?: string;
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * 결제 승인 요청
 */
export interface PaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

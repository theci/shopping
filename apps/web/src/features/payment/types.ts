/**
 * Payment Feature Types
 */

export type { ApiResponse } from '@/lib/api/types';

/**
 * 결제 상태
 */
export type PaymentStatus =
  | 'READY'              // 결제 준비
  | 'IN_PROGRESS'        // 결제 진행중
  | 'DONE'               // 결제 완료
  | 'CANCELED'           // 결제 취소
  | 'PARTIAL_CANCELED'   // 부분 취소
  | 'ABORTED'            // 결제 중단
  | 'EXPIRED';           // 결제 만료

/**
 * 결제 수단 타입
 */
export type PaymentMethodType =
  | 'CARD'               // 카드
  | 'VIRTUAL_ACCOUNT'    // 가상계좌
  | 'EASY_PAY'           // 간편결제
  | 'BANK_TRANSFER'      // 계좌이체
  | 'MOBILE'             // 휴대폰 결제
  | 'CULTURE_GIFT_CERTIFICATE' // 문화상품권
  | 'FOREIGN_EASY_PAY';  // 해외 간편결제

/**
 * 결제 요청 정보 (Toss Payments)
 */
export interface PaymentRequest {
  orderId: string;
  orderName: string;
  amount: number;
  customerEmail?: string;
  customerName?: string;
  customerMobilePhone?: string;
}

/**
 * 결제 승인 요청
 */
export interface PaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

/**
 * 결제 승인 응답
 */
export interface PaymentConfirmResponse {
  paymentKey: string;
  orderId: string;
  orderName: string;
  status: PaymentStatus;
  method: PaymentMethodType;
  totalAmount: number;
  balanceAmount: number;
  requestedAt: string;
  approvedAt?: string;
  cancels?: PaymentCancel[];
  card?: CardInfo;
  virtualAccount?: VirtualAccountInfo;
  easyPay?: EasyPayInfo;
}

/**
 * 결제 취소 정보
 */
export interface PaymentCancel {
  cancelAmount: number;
  cancelReason: string;
  canceledAt: string;
}

/**
 * 카드 결제 정보
 */
export interface CardInfo {
  company: string;
  number: string;
  installmentPlanMonths: number;
  approveNo: string;
  cardType: 'CREDIT' | 'DEBIT' | 'GIFT';
  ownerType: 'PERSONAL' | 'CORPORATE';
}

/**
 * 가상계좌 정보
 */
export interface VirtualAccountInfo {
  accountNumber: string;
  accountType: 'NORMAL' | 'FIXED';
  bank: string;
  customerName: string;
  dueDate: string;
}

/**
 * 간편결제 정보
 */
export interface EasyPayInfo {
  provider: string;
  amount: number;
  discountAmount: number;
}

/**
 * 결제 위젯 Props
 */
export interface PaymentWidgetProps {
  clientKey: string;
  customerKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
  onPaymentReady?: () => void;
  onPaymentMethodChange?: (method: string) => void;
}

/**
 * 결제 성공 콜백 파라미터
 */
export interface PaymentSuccessParams {
  paymentKey: string;
  orderId: string;
  amount: string;
}

/**
 * 결제 실패 콜백 파라미터
 */
export interface PaymentFailParams {
  code: string;
  message: string;
  orderId?: string;
}

/**
 * 주문 결제 정보
 */
export interface OrderPaymentInfo {
  orderId: number;
  orderNumber: string;
  paymentKey?: string;
  amount: number;
  status: PaymentStatus;
  method?: PaymentMethodType;
  paidAt?: string;
}

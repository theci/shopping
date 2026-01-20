import { apiClient } from '@/lib/api/client';
import type {
  PaymentConfirmRequest,
  PaymentConfirmResponse,
  OrderPaymentInfo,
  ApiResponse,
} from '../types';

/**
 * 결제 API
 */
export const paymentApi = {
  /**
   * 결제 승인 요청
   * Toss Payments에서 결제가 성공하면 paymentKey, orderId, amount를 받아
   * 백엔드에서 최종 결제 승인을 처리합니다.
   */
  confirmPayment: async (data: PaymentConfirmRequest): Promise<PaymentConfirmResponse> => {
    const response = await apiClient.post<ApiResponse<PaymentConfirmResponse>>(
      '/api/v1/payments/confirm',
      data
    );
    return response.data.data;
  },

  /**
   * 주문의 결제 정보 조회
   */
  getPaymentByOrderId: async (orderId: number): Promise<OrderPaymentInfo> => {
    const response = await apiClient.get<ApiResponse<OrderPaymentInfo>>(
      `/api/v1/payments/orders/${orderId}`
    );
    return response.data.data;
  },

  /**
   * 결제 취소
   */
  cancelPayment: async (paymentKey: string, cancelReason: string): Promise<PaymentConfirmResponse> => {
    const response = await apiClient.post<ApiResponse<PaymentConfirmResponse>>(
      `/api/v1/payments/${paymentKey}/cancel`,
      { cancelReason }
    );
    return response.data.data;
  },

  /**
   * 가상계좌 입금 확인 (웹훅용 - 일반적으로 백엔드에서 처리)
   */
  checkVirtualAccountDeposit: async (orderId: string): Promise<boolean> => {
    const response = await apiClient.get<ApiResponse<{ deposited: boolean }>>(
      `/api/v1/payments/virtual-account/${orderId}/status`
    );
    return response.data.data.deposited;
  },
};

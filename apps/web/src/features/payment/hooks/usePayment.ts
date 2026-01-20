'use client';

import { useState, useCallback } from 'react';
import type { PaymentRequest } from '../types';

/**
 * 고유한 결제용 orderId 생성
 */
function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `ORDER_${timestamp}_${random}`;
}

/**
 * 결제 프로세스 관리 훅
 */
export function usePayment() {
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentReady = useCallback(() => {
    setIsPaymentReady(true);
  }, []);

  const handlePaymentMethodChange = useCallback((method: string) => {
    setPaymentMethod(method);
  }, []);

  const preparePayment = useCallback((
    orderInfo: Omit<PaymentRequest, 'orderId'>
  ): PaymentRequest => {
    return {
      ...orderInfo,
      orderId: generateOrderId(),
    };
  }, []);

  const startProcessing = useCallback(() => {
    setIsProcessing(true);
  }, []);

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
  }, []);

  return {
    isPaymentReady,
    paymentMethod,
    isProcessing,
    handlePaymentReady,
    handlePaymentMethodChange,
    preparePayment,
    startProcessing,
    stopProcessing,
    generateOrderId,
  };
}

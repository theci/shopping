'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, Button, Spinner } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import type { PaymentWidgetProps } from '../../types';

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

export function PaymentWidget({
  clientKey = TOSS_CLIENT_KEY,
  customerKey,
  amount,
  orderId,
  orderName,
  customerEmail,
  customerName,
  onPaymentReady,
  onPaymentMethodChange,
}: PaymentWidgetProps) {
  const widgetsRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);

  // 결제 위젯 초기화
  useEffect(() => {
    let mounted = true;

    const initWidget = async () => {
      if (!clientKey) {
        setError('Toss Payments 클라이언트 키가 설정되지 않았습니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Toss Payments SDK 동적 로드 (클라이언트에서만 실행)
        const { loadTossPayments } = await import('@tosspayments/tosspayments-sdk');
        const tossPayments = await loadTossPayments(clientKey);

        if (!mounted) return;

        // 위젯 인스턴스 생성
        const widgets = tossPayments.widgets({
          customerKey,
        });

        widgetsRef.current = widgets;

        // 결제 금액 설정
        await widgets.setAmount({
          currency: 'KRW',
          value: amount,
        });

        if (!mounted) return;

        // 결제 수단 위젯 렌더링
        await widgets.renderPaymentMethods({
          selector: '#payment-methods',
          variantKey: 'DEFAULT',
        });

        if (!mounted) return;

        // 약관 위젯 렌더링
        await widgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT',
        });

        if (!mounted) return;

        setIsReady(true);
        setIsLoading(false);
        onPaymentReady?.();
      } catch (err) {
        if (!mounted) return;
        console.error('Payment widget initialization error:', err);
        setError('결제 위젯을 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };

    initWidget();

    return () => {
      mounted = false;
    };
  }, [clientKey, customerKey, amount, onPaymentReady]);

  // 금액 변경 시 업데이트
  useEffect(() => {
    if (widgetsRef.current && isReady) {
      widgetsRef.current.setAmount({
        currency: 'KRW',
        value: amount,
      });
    }
  }, [amount, isReady]);

  // 결제 요청
  const handlePayment = async () => {
    if (!widgetsRef.current || !isReady) {
      setError('결제 위젯이 준비되지 않았습니다.');
      return;
    }

    try {
      setIsPaymentInProgress(true);

      await widgetsRef.current.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail,
        customerName,
      });
    } catch (err: any) {
      // 사용자가 결제를 취소한 경우
      if (err.code === 'USER_CANCEL') {
        console.log('User cancelled the payment');
      } else {
        console.error('Payment request error:', err);
        setError(err.message || '결제 요청 중 오류가 발생했습니다.');
      }
    } finally {
      setIsPaymentInProgress(false);
    }
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-4">결제 수단</h3>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
          <span className="ml-3 text-gray-500">결제 위젯을 불러오는 중...</span>
        </div>
      )}

      {/* 결제 수단 선택 위젯 */}
      <div id="payment-methods" className={isLoading ? 'hidden' : ''} />

      {/* 약관 동의 위젯 */}
      <div id="agreement" className={`mt-4 ${isLoading ? 'hidden' : ''}`} />

      {/* 결제 버튼 */}
      {isReady && (
        <Button
          className="w-full mt-6"
          size="lg"
          onClick={handlePayment}
          isLoading={isPaymentInProgress}
          disabled={!isReady || isPaymentInProgress}
        >
          {formatPrice(amount)} 결제하기
        </Button>
      )}

      {/* 안내 문구 */}
      <p className="text-xs text-gray-500 text-center mt-4">
        위 주문 내용을 확인하였으며, 결제에 동의합니다.
      </p>
    </Card>
  );
}

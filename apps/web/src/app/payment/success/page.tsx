'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Loader2 } from 'lucide-react';
import { Card, Button, Spinner } from '@/shared/components/ui';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { usePaymentConfirm } from '@/features/payment/hooks';
import { formatPrice } from '@/shared/utils/format';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [isProcessed, setIsProcessed] = useState(false);

  const { mutate: confirmPayment, isPending, isSuccess, isError, data, error } = usePaymentConfirm();

  // URL 파라미터에서 결제 정보 추출
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  // 결제 승인 처리
  useEffect(() => {
    if (paymentKey && orderId && amount && !isProcessed) {
      setIsProcessed(true);
      confirmPayment({
        paymentKey,
        orderId,
        amount: Number(amount),
      });
    }
  }, [paymentKey, orderId, amount, confirmPayment, isProcessed]);

  // 필수 파라미터 체크
  if (!paymentKey || !orderId || !amount) {
    return (
      <Card className="max-w-lg mx-auto p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">잘못된 접근입니다</h1>
          <p className="text-gray-500 mb-6">결제 정보가 올바르지 않습니다.</p>
          <Link href="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
        </div>
      </Card>
    );
  }

  // 결제 승인 처리 중
  if (isPending) {
    return (
      <Card className="max-w-lg mx-auto p-8">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">결제 승인 처리 중</h1>
          <p className="text-gray-500">잠시만 기다려주세요...</p>
        </div>
      </Card>
    );
  }

  // 결제 승인 실패
  if (isError) {
    const errorMessage = (error as any)?.response?.data?.message || '결제 승인에 실패했습니다.';

    return (
      <Card className="max-w-lg mx-auto p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">✕</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">결제 승인 실패</h1>
          <p className="text-gray-500 mb-6">{errorMessage}</p>
          <div className="space-y-3">
            <Link href="/checkout" className="block">
              <Button fullWidth>다시 결제하기</Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" fullWidth>
                홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  // 결제 승인 성공
  return (
    <Card className="max-w-lg mx-auto p-8">
      <div className="text-center">
        {/* 성공 아이콘 */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h1>
        <p className="text-gray-500 mb-8">주문이 성공적으로 처리되었습니다.</p>

        {/* 결제 정보 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-medium text-gray-900 mb-3">결제 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">주문번호</span>
              <span className="font-medium text-gray-900">{data?.orderId || orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">결제 수단</span>
              <span className="font-medium text-gray-900">{data?.method || '카드'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">결제 금액</span>
              <span className="font-bold text-blue-600">
                {formatPrice(data?.totalAmount || Number(amount))}
              </span>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <Link href={`/mypage/orders/${orderId}`} className="block">
            <Button fullWidth leftIcon={<Package className="w-4 h-4" />}>
              주문 상세 보기
            </Button>
          </Link>
          <Link href="/products" className="block">
            <Button variant="outline" fullWidth>
              쇼핑 계속하기
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

function LoadingFallback() {
  return (
    <Card className="max-w-lg mx-auto p-8">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-500">로딩 중...</p>
      </div>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <Suspense fallback={<LoadingFallback />}>
            <PaymentSuccessContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}

'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, Home, Phone } from 'lucide-react';
import { Card, Button, Spinner } from '@/shared/components/ui';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';

// 에러 코드별 메시지 매핑
const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  PAY_PROCESS_CANCELED: {
    title: '결제가 취소되었습니다',
    description: '결제 진행 중 취소하셨습니다. 다시 시도해주세요.',
  },
  PAY_PROCESS_ABORTED: {
    title: '결제가 중단되었습니다',
    description: '결제 진행 중 문제가 발생했습니다.',
  },
  REJECT_CARD_COMPANY: {
    title: '카드사 거절',
    description: '카드사에서 결제를 거절했습니다. 다른 결제 수단을 이용해주세요.',
  },
  EXCEED_MAX_DAILY_PAYMENT_COUNT: {
    title: '일일 결제 한도 초과',
    description: '오늘 결제 가능한 횟수를 초과했습니다.',
  },
  EXCEED_MAX_PAYMENT_AMOUNT: {
    title: '결제 금액 한도 초과',
    description: '결제 금액이 허용된 한도를 초과했습니다.',
  },
  INVALID_CARD_NUMBER: {
    title: '유효하지 않은 카드번호',
    description: '입력한 카드번호가 유효하지 않습니다.',
  },
  INVALID_CARD_EXPIRATION: {
    title: '카드 유효기간 오류',
    description: '카드 유효기간을 확인해주세요.',
  },
  INVALID_STOPPED_CARD: {
    title: '정지된 카드',
    description: '사용이 정지된 카드입니다. 카드사에 문의해주세요.',
  },
  INVALID_CARD_LOST_OR_STOLEN: {
    title: '분실 또는 도난 카드',
    description: '분실 또는 도난 신고된 카드입니다.',
  },
  DUPLICATED_ORDER_ID: {
    title: '중복된 주문',
    description: '이미 처리된 주문입니다.',
  },
  PROVIDER_ERROR: {
    title: '결제 서비스 오류',
    description: '결제 서비스에 일시적인 문제가 발생했습니다.',
  },
  UNKNOWN_PAYMENT_ERROR: {
    title: '결제 오류',
    description: '알 수 없는 결제 오류가 발생했습니다.',
  },
};

function PaymentFailContent() {
  const searchParams = useSearchParams();

  const code = searchParams.get('code') || 'UNKNOWN_PAYMENT_ERROR';
  const message = searchParams.get('message');
  const orderId = searchParams.get('orderId');

  // 에러 정보 조회
  const errorInfo = ERROR_MESSAGES[code] || {
    title: '결제에 실패했습니다',
    description: message || '결제 처리 중 문제가 발생했습니다.',
  };

  return (
    <Card className="max-w-lg mx-auto p-8">
      <div className="text-center">
        {/* 실패 아이콘 */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{errorInfo.title}</h1>
        <p className="text-gray-500 mb-2">{errorInfo.description}</p>

        {/* 에러 코드 표시 */}
        {code && (
          <p className="text-xs text-gray-400 mb-8">
            오류 코드: {code}
          </p>
        )}

        {/* 주문 번호가 있는 경우 */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">
              주문번호: <span className="font-medium text-gray-900">{orderId}</span>
            </p>
          </div>
        )}

        {/* 버튼 */}
        <div className="space-y-3">
          <Link href="/checkout" className="block">
            <Button fullWidth leftIcon={<RefreshCw className="w-4 h-4" />}>
              다시 결제하기
            </Button>
          </Link>
          <Link href="/cart" className="block">
            <Button variant="outline" fullWidth>
              장바구니로 돌아가기
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="ghost" fullWidth leftIcon={<Home className="w-4 h-4" />}>
              홈으로 돌아가기
            </Button>
          </Link>
        </div>

        {/* 고객센터 안내 */}
        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-gray-500 mb-2">문제가 계속되시나요?</p>
          <a
            href="tel:1588-0000"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <Phone className="w-4 h-4" />
            고객센터 1588-0000
          </a>
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

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <Suspense fallback={<LoadingFallback />}>
            <PaymentFailContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}

'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Home } from 'lucide-react';
import { Card, Button, Skeleton } from '@/shared/components/ui';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { useOrder } from '@/features/order/hooks';
import { formatPrice, formatDate } from '@/shared/utils/format';

function OrderCompleteContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { data: order, isLoading } = useOrder(orderId ? parseInt(orderId, 10) : 0);

  if (!orderId) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">주문 정보를 찾을 수 없습니다.</p>
        <Link href="/products" className="mt-4 inline-block">
          <Button>쇼핑 계속하기</Button>
        </Link>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-center mb-8">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">주문 정보를 불러올 수 없습니다.</p>
        <Link href="/mypage/orders" className="mt-4 inline-block">
          <Button>주문 내역 확인</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      {/* 완료 아이콘 & 메시지 */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">주문이 완료되었습니다!</h1>
        <p className="text-gray-500">주문해 주셔서 감사합니다.</p>
      </div>

      {/* 주문 정보 */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">주문 정보</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">주문번호</dt>
            <dd className="font-medium text-gray-900">{order.orderNumber}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">주문일시</dt>
            <dd className="text-gray-900">{formatDate(order.createdAt)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">주문상품</dt>
            <dd className="text-gray-900">
              {order.items[0]?.productName}
              {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
            </dd>
          </div>
          <div className="flex justify-between pt-3 border-t">
            <dt className="font-bold text-gray-900">총 결제금액</dt>
            <dd className="font-bold text-blue-600 text-lg">{formatPrice(order.totalAmount)}</dd>
          </div>
        </dl>
      </div>

      {/* 배송지 정보 */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-4">배송지 정보</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex">
            <dt className="w-20 text-gray-500">수령인</dt>
            <dd className="text-gray-900">{order.shippingInfo.recipientName}</dd>
          </div>
          <div className="flex">
            <dt className="w-20 text-gray-500">연락처</dt>
            <dd className="text-gray-900">{order.shippingInfo.phone}</dd>
          </div>
          <div className="flex">
            <dt className="w-20 text-gray-500">주소</dt>
            <dd className="text-gray-900">
              [{order.shippingInfo.zipCode}] {order.shippingInfo.address}
              {order.shippingInfo.addressDetail && `, ${order.shippingInfo.addressDetail}`}
            </dd>
          </div>
        </dl>
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={`/mypage/orders/${order.id}`} className="flex-1">
          <Button variant="primary" className="w-full">
            <Package className="w-4 h-4 mr-2" />
            주문 상세 보기
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full">
            <Home className="w-4 h-4 mr-2" />
            홈으로 가기
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export default function OrderCompletePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Suspense
            fallback={
              <Card className="p-8">
                <div className="text-center">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-8 w-48 mx-auto mb-2" />
                  <Skeleton className="h-5 w-64 mx-auto" />
                </div>
              </Card>
            }
          >
            <OrderCompleteContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}

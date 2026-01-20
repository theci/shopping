'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { Card, Button, Skeleton } from '@/shared/components/ui';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { ShippingInfo } from '@/features/order/components/OrderForm/ShippingInfo';
import { PaymentWidget } from '@/features/payment';
import { usePayment } from '@/features/payment/hooks';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuthStore } from '@/features/auth/store/authStore';
import { formatPrice } from '@/shared/utils/format';
import type { ShippingInfo as ShippingInfoType } from '@/features/order/types';

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';
const FREE_SHIPPING_THRESHOLD = 50000;
const SHIPPING_FEE = 3000;

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, customer } = useAuthStore();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const { preparePayment, handlePaymentReady, isPaymentReady } = usePayment();

  const [shippingInfo, setShippingInfo] = useState<ShippingInfoType | null>(null);

  // 인증 체크
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, isInitialized, router]);

  // 장바구니가 비어있으면 리다이렉트
  useEffect(() => {
    if (!isCartLoading && cart && cart.items.length === 0) {
      router.push('/cart');
    }
  }, [cart, isCartLoading, router]);

  // 금액 계산
  const { subtotal, shippingFee, totalAmount, orderName } = useMemo(() => {
    if (!cart?.items.length) {
      return { subtotal: 0, shippingFee: 0, totalAmount: 0, orderName: '' };
    }

    const sub = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = sub + shipping;
    const name =
      cart.items.length === 1
        ? cart.items[0].productName
        : `${cart.items[0].productName} 외 ${cart.items.length - 1}건`;

    return { subtotal: sub, shippingFee: shipping, totalAmount: total, orderName: name };
  }, [cart?.items]);

  // 결제 정보 준비
  const paymentInfo = useMemo(() => {
    if (!totalAmount || !customer) return null;

    return preparePayment({
      orderName,
      amount: totalAmount,
      customerEmail: customer.email,
      customerName: customer.name,
    });
  }, [totalAmount, customer, orderName, preparePayment]);

  // 배송지 입력 완료 여부
  const isShippingInfoValid =
    shippingInfo !== null &&
    shippingInfo.recipientName !== '' &&
    shippingInfo.phone !== '' &&
    shippingInfo.zipCode !== '' &&
    shippingInfo.address !== '';

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isCartLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="flex gap-8">
              <div className="flex-1 space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
              <div className="w-96">
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <Card className="p-12">
              <div className="text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">장바구니가 비어있습니다</h2>
                <p className="text-gray-500 mb-6">상품을 담아주세요.</p>
                <Link href="/products">
                  <Button>상품 둘러보기</Button>
                </Link>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* 뒤로가기 */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            장바구니
          </Link>

          {/* 페이지 타이틀 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-8">주문/결제</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* 왼쪽: 입력 폼 */}
            <div className="flex-1 space-y-6">
              {/* 배송지 정보 */}
              <ShippingInfo value={shippingInfo} onChange={setShippingInfo} />

              {/* 결제 수단 - Toss Payments 위젯 */}
              {paymentInfo && isShippingInfoValid && (
                <PaymentWidget
                  clientKey={TOSS_CLIENT_KEY}
                  customerKey={`CUSTOMER_${customer?.id || 'GUEST'}`}
                  amount={paymentInfo.amount}
                  orderId={paymentInfo.orderId}
                  orderName={paymentInfo.orderName}
                  customerEmail={paymentInfo.customerEmail}
                  customerName={paymentInfo.customerName}
                  onPaymentReady={handlePaymentReady}
                />
              )}

              {/* 배송지 미입력 시 안내 */}
              {!isShippingInfoValid && (
                <Card className="p-6">
                  <div className="text-center py-8 text-gray-500">
                    <p>배송지 정보를 입력하시면 결제 수단을 선택할 수 있습니다.</p>
                  </div>
                </Card>
              )}
            </div>

            {/* 오른쪽: 주문 요약 */}
            <div className="lg:w-96">
              <Card className="p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4">주문 요약</h3>

                {/* 상품 목록 */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={item.productImage || '/placeholder.png'}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">수량: {item.quantity}</p>
                        <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 금액 정보 */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">상품 금액</span>
                    <span className="text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">배송비</span>
                    <span className="text-gray-900">
                      {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-bold text-gray-900">총 결제 금액</span>
                    <span className="font-bold text-blue-600 text-xl">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                {/* 무료 배송 안내 */}
                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-gray-500 text-center mt-4">
                    {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} 더 구매 시 무료 배송!
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

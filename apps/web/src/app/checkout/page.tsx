'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { Card, Button, Skeleton } from '@/shared/components/ui';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { OrderForm } from '@/features/order/components';
import { useCreateOrder } from '@/features/order/hooks';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const { mutate: createOrder, isPending: isSubmitting } = useCreateOrder();

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

          {/* 주문 폼 */}
          <OrderForm
            items={cart.items}
            onSubmit={createOrder}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

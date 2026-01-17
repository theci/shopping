import Link from 'next/link';
import { Button } from '@/shared/components/ui';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* 히어로 섹션 */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Welcome to E-Commerce Store
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          최고의 쇼핑 경험을 제공하는 프로덕션급 이커머스 플랫폼
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/products">
            <Button size="lg">상품 둘러보기</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">로그인</Button>
          </Link>
        </div>
      </section>

      {/* 기능 미리보기 섹션 */}
      <section className="py-16">
        <h2 className="text-2xl font-bold text-center mb-12">주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛒</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">장바구니</h3>
            <p className="text-gray-600 text-sm">
              간편한 장바구니 기능으로 원하는 상품을 담아보세요
            </p>
          </div>
          <div className="text-center p-6 rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">간편 결제</h3>
            <p className="text-gray-600 text-sm">
              다양한 결제 수단으로 빠르고 안전하게 결제하세요
            </p>
          </div>
          <div className="text-center p-6 rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">빠른 배송</h3>
            <p className="text-gray-600 text-sm">
              주문 즉시 배송 준비로 빠르게 받아보세요
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

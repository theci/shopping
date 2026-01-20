'use client';

import Link from 'next/link';
import { ChevronLeft, Package } from 'lucide-react';
import { Card } from '@/shared/components/ui';

export default function OrdersPage() {
  // TODO: Step 6에서 주문 기능 구현 시 완성
  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link
        href="/mypage"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="w-4 h-4" />
        마이페이지
      </Link>

      {/* 페이지 타이틀 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">주문 내역</h2>
        <p className="text-sm text-gray-500 mt-1">주문 및 배송 현황을 확인하세요.</p>
      </div>

      {/* 빈 상태 */}
      <Card className="p-12">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">주문 내역이 없습니다</h3>
          <p className="text-gray-500 mb-6">첫 주문을 시작해보세요!</p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            상품 둘러보기
          </Link>
        </div>
      </Card>
    </div>
  );
}

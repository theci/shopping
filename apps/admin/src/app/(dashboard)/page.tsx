'use client';

import { Header } from '@/shared/components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui';
import { formatNumber, formatPrice } from '@/shared/utils/format';

// 임시 통계 데이터
const stats = [
  { label: '총 매출', value: formatPrice(12500000), change: '+12.5%', positive: true },
  { label: '주문 수', value: formatNumber(156), change: '+8.2%', positive: true },
  { label: '신규 고객', value: formatNumber(24), change: '+15.3%', positive: true },
  { label: '평균 주문가', value: formatPrice(80128), change: '-2.4%', positive: false },
];

export default function DashboardPage() {
  return (
    <>
      <Header title="대시보드" />
      <div className="p-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  <span
                    className={`text-sm font-medium ${
                      stat.positive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 최근 주문 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>최근 주문</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                주문 데이터가 없습니다.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>베스트 상품</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                상품 데이터가 없습니다.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

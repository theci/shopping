'use client';

import { useState } from 'react';
import { DollarSign, ShoppingCart, Users, TrendingUp, Calendar } from 'lucide-react';
import { Header } from '@/shared/components/layout';
import { Spinner } from '@/shared/components/ui';
import { formatPrice, formatNumber } from '@/shared/utils/format';
import {
  StatCard,
  SalesChart,
  OrdersChart,
  TopProducts,
  RecentOrders,
  useDashboardStats,
  DATE_RANGE_OPTIONS,
  type DateRange,
} from '@/features/analytics';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const { data: stats, isLoading } = useDashboardStats({ range: dateRange });

  return (
    <div>
      <Header
        title="통계"
        actions={
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {DATE_RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* 통계 카드 */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-lg animate-pulse" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="총 매출"
              value={formatPrice(stats.totalSales)}
              icon={<DollarSign className="w-6 h-6" />}
              change={stats.salesGrowth}
            />
            <StatCard
              title="총 주문"
              value={`${formatNumber(stats.totalOrders)}건`}
              icon={<ShoppingCart className="w-6 h-6" />}
              change={stats.ordersGrowth}
            />
            <StatCard
              title="신규 고객"
              value={`${formatNumber(stats.newCustomers)}명`}
              icon={<Users className="w-6 h-6" />}
              change={stats.customersGrowth}
            />
            <StatCard
              title="평균 주문 금액"
              value={formatPrice(stats.averageOrderValue)}
              icon={<TrendingUp className="w-6 h-6" />}
            />
          </div>
        ) : null}

        {/* 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <div>
            <OrdersChart />
          </div>
        </div>

        {/* 베스트셀러 & 최근 주문 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProducts limit={5} />
          <RecentOrders limit={5} />
        </div>
      </div>
    </div>
  );
}

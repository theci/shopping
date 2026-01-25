'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, Spinner } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import { useDailySales, useMonthlySales } from '../../hooks';

type ViewType = 'daily' | 'monthly';

export function SalesChart() {
  const [viewType, setViewType] = useState<ViewType>('daily');

  const { data: dailyData, isLoading: isDailyLoading } = useDailySales({ range: 'month' });
  const { data: monthlyData, isLoading: isMonthlyLoading } = useMonthlySales({ range: 'year' });

  const isLoading = viewType === 'daily' ? isDailyLoading : isMonthlyLoading;
  const data = viewType === 'daily' ? dailyData : monthlyData;

  const formatXAxis = (value: string) => {
    if (viewType === 'daily') {
      const date = new Date(value);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
    return value;
  };

  const formatTooltipValue = (value: number) => formatPrice(value);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>매출 추이</CardTitle>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('daily')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === 'daily'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              일별
            </button>
            <button
              onClick={() => setViewType('monthly')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              월별
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : !data?.length ? (
          <div className="h-80 flex items-center justify-center text-gray-500">
            데이터가 없습니다.
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey={viewType === 'daily' ? 'date' : 'month'}
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={formatTooltipValue}
                  labelFormatter={(label) =>
                    viewType === 'daily' ? new Date(label).toLocaleDateString('ko-KR') : label
                  }
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="매출"
                  stroke="#9333ea"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, Spinner } from '@/shared/components/ui';
import { useOrderStatusStats } from '../../hooks';

const COLORS = ['#9333ea', '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#6b7280'];

export function OrdersChart() {
  const { data, isLoading } = useOrderStatusStats({ range: 'month' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>주문 상태 현황</CardTitle>
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
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="label"
                  label={({ label, percentage }) => `${label} ${percentage.toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value}건`, name]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

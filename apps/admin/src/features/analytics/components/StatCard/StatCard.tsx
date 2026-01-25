'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  change,
  changeLabel = '전월 대비',
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const hasChange = change !== undefined;

  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {hasChange && (
            <div className="mt-2 flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {isPositive ? '+' : ''}
                {change.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-400">{changeLabel}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
          {icon}
        </div>
      </div>
    </Card>
  );
}

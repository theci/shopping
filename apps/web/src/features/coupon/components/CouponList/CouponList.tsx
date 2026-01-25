'use client';

import { useState } from 'react';
import { Button, Skeleton } from '@/shared/components/ui';
import { useCoupons, useIssueCoupon } from '../../hooks';
import { CouponCard } from '../CouponCard';
import type { CouponStatus } from '../../types';

interface CouponListProps {
  showIssueForm?: boolean;
}

const STATUS_TABS: { value: CouponStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'ACTIVE', label: '사용 가능' },
  { value: 'USED', label: '사용 완료' },
  { value: 'EXPIRED', label: '기간 만료' },
];

export function CouponList({ showIssueForm = true }: CouponListProps) {
  const [statusFilter, setStatusFilter] = useState<CouponStatus | 'ALL'>('ALL');
  const [couponCode, setCouponCode] = useState('');

  const { data, isLoading, error } = useCoupons(
    statusFilter === 'ALL' ? undefined : { status: statusFilter }
  );
  const { mutate: issueCoupon, isPending: isIssuing } = useIssueCoupon();

  const handleIssueCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    issueCoupon(
      { couponCode: couponCode.trim() },
      {
        onSuccess: () => setCouponCode(''),
      }
    );
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">쿠폰을 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 쿠폰 발급 폼 */}
      {showIssueForm && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">쿠폰 등록</h3>
          <form onSubmit={handleIssueCoupon} className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="쿠폰 코드를 입력하세요"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Button type="submit" isLoading={isIssuing} disabled={!couponCode.trim()}>
              등록
            </Button>
          </form>
        </div>
      )}

      {/* 상태 필터 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              statusFilter === tab.value
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 쿠폰 목록 */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CouponCardSkeleton key={i} />
          ))}
        </div>
      ) : !data?.content?.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {statusFilter === 'ALL'
              ? '보유한 쿠폰이 없습니다.'
              : `${STATUS_TABS.find((t) => t.value === statusFilter)?.label} 쿠폰이 없습니다.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.content.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 쿠폰 카드 스켈레톤
 */
function CouponCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 p-4 pl-6">
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gray-200" />
      <div className="flex items-start justify-between mb-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-5 w-48 mb-1" />
      <Skeleton className="h-4 w-64 mb-2" />
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-6 w-28 rounded" />
        <Skeleton className="h-6 w-32 rounded" />
      </div>
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

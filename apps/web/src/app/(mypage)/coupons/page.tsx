'use client';

import { CouponList } from '@/features/coupon';

export default function CouponsPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">내 쿠폰</h2>
      <CouponList showIssueForm />
    </div>
  );
}

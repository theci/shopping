'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Skeleton, Card } from '@/shared/components/ui';
import { ProfileForm } from '@/features/customer/components';
import { useCustomer } from '@/features/customer/hooks';

export default function ProfilePage() {
  const { data: customer, isLoading } = useCustomer();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Card className="p-6">
          <Skeleton className="h-6 w-24 mb-6" />
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">고객 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

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

      {/* 프로필 폼 */}
      <ProfileForm customer={customer} />
    </div>
  );
}

'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Card, Skeleton } from '@/shared/components/ui';
import { AddressForm } from '@/features/customer/components';
import { useAddress } from '@/features/customer/hooks';

interface EditAddressPageProps {
  params: Promise<{ id: string }>;
}

export default function EditAddressPage({ params }: EditAddressPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const addressId = parseInt(id, 10);

  const { data: address, isLoading, error } = useAddress(addressId);

  const handleCancel = () => {
    router.push('/mypage/addresses');
  };

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

  if (error || !address) {
    return (
      <div className="space-y-6">
        <Link
          href="/mypage/addresses"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
          배송지 관리
        </Link>
        <Card className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">배송지 정보를 불러올 수 없습니다.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link
        href="/mypage/addresses"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="w-4 h-4" />
        배송지 관리
      </Link>

      {/* 배송지 수정 폼 */}
      <AddressForm address={address} onCancel={handleCancel} />
    </div>
  );
}

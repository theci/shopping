'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { AddressList } from '@/features/customer/components';
import { useAddresses } from '@/features/customer/hooks';
import type { Address } from '@/features/customer/types';

export default function AddressesPage() {
  const router = useRouter();
  const { data: addresses, isLoading } = useAddresses();

  const handleEdit = (address: Address) => {
    router.push(`/mypage/addresses/${address.id}/edit`);
  };

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
        <h2 className="text-xl font-bold text-gray-900">배송지 관리</h2>
        <p className="text-sm text-gray-500 mt-1">배송지를 추가하고 관리하세요.</p>
      </div>

      {/* 배송지 목록 */}
      <AddressList
        addresses={addresses || []}
        isLoading={isLoading}
        onEdit={handleEdit}
      />
    </div>
  );
}

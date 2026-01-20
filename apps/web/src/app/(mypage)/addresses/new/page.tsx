'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { AddressForm } from '@/features/customer/components';

export default function NewAddressPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/mypage/addresses');
  };

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

      {/* 배송지 추가 폼 */}
      <AddressForm onCancel={handleCancel} />
    </div>
  );
}

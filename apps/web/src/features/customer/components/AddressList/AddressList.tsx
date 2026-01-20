'use client';

import Link from 'next/link';
import { Plus, MapPin } from 'lucide-react';
import { Button, Skeleton } from '@/shared/components/ui';
import { AddressCard } from './AddressCard';
import type { Address } from '../../types';

interface AddressListProps {
  addresses: Address[];
  isLoading?: boolean;
  onEdit?: (address: Address) => void;
}

export function AddressList({ addresses, isLoading, onEdit }: AddressListProps) {
  if (isLoading) {
    return <AddressListSkeleton />;
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 배송지가 없습니다</h3>
        <p className="text-gray-500 mb-6">배송지를 추가해주세요.</p>
        <Link href="/mypage/addresses/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            배송지 추가
          </Button>
        </Link>
      </div>
    );
  }

  // 기본 배송지를 맨 앞으로 정렬
  const sortedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* 배송지 추가 버튼 */}
      <div className="flex justify-end">
        <Link href="/mypage/addresses/new">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            배송지 추가
          </Button>
        </Link>
      </div>

      {/* 배송지 목록 */}
      <div className="space-y-3">
        {sortedAddresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onEdit={onEdit}
          />
        ))}
      </div>

      {/* 안내 문구 */}
      <p className="text-xs text-gray-500 mt-4">
        * 기본 배송지는 삭제할 수 없습니다. 다른 배송지를 기본으로 설정한 후 삭제해주세요.
      </p>
    </div>
  );
}

function AddressListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Skeleton className="h-9 w-28" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { MapPin, Edit2, Trash2, Star } from 'lucide-react';
import { Button, Card, Badge } from '@/shared/components/ui';
import { useDeleteAddress, useSetDefaultAddress } from '../../hooks/useDeleteAddress';
import type { Address } from '../../types';

interface AddressCardProps {
  address: Address;
  onEdit?: (address: Address) => void;
}

export function AddressCard({ address, onEdit }: AddressCardProps) {
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();
  const { mutate: setDefault, isPending: isSettingDefault } = useSetDefaultAddress();

  const handleDelete = () => {
    if (window.confirm('이 배송지를 삭제하시겠습니까?')) {
      deleteAddress(address.id);
    }
  };

  const handleSetDefault = () => {
    setDefault(address.id);
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* 배송지명 & 기본 배송지 뱃지 */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-gray-900">{address.name}</h3>
            {address.isDefault && (
              <Badge variant="primary" className="text-xs">
                기본 배송지
              </Badge>
            )}
          </div>

          {/* 수령인 정보 */}
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium">{address.recipientName}</p>
            <p>{address.phone}</p>
          </div>

          {/* 주소 */}
          <div className="flex items-start gap-2 mt-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
            <div>
              <p>[{address.zipCode}]</p>
              <p>{address.address}</p>
              {address.addressDetail && <p>{address.addressDetail}</p>}
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-1 ml-4">
          {!address.isDefault && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSetDefault}
              disabled={isSettingDefault}
              className="text-gray-500 hover:text-blue-600"
            >
              <Star className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(address)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting || address.isDefault}
            className="text-gray-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

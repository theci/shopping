'use client';

import { useState } from 'react';
import { Card, Button, Input } from '@/shared/components/ui';
import { useAddresses } from '@/features/customer/hooks';
import type { Address } from '@/features/customer/types';
import type { ShippingInfo as ShippingInfoType } from '../../types';

interface ShippingInfoProps {
  value: ShippingInfoType | null;
  onChange: (info: ShippingInfoType) => void;
}

export function ShippingInfo({ value, onChange }: ShippingInfoProps) {
  const { data: addresses, isLoading } = useAddresses();
  const [isCustom, setIsCustom] = useState(false);
  const [customForm, setCustomForm] = useState<ShippingInfoType>({
    recipientName: '',
    phone: '',
    zipCode: '',
    address: '',
    addressDetail: '',
    memo: '',
  });

  const handleSelectAddress = (address: Address) => {
    onChange({
      recipientName: address.recipientName,
      phone: address.phone,
      zipCode: address.zipCode,
      address: address.address,
      addressDetail: address.addressDetail,
      memo: '',
    });
    setIsCustom(false);
  };

  const handleCustomFormChange = (field: keyof ShippingInfoType, fieldValue: string) => {
    const updated = { ...customForm, [field]: fieldValue };
    setCustomForm(updated);
    onChange(updated);
  };

  const handleAddressSearch = () => {
    if (typeof window !== 'undefined' && (window as any).daum?.Postcode) {
      new (window as any).daum.Postcode({
        oncomplete: (data: any) => {
          handleCustomFormChange('zipCode', data.zonecode);
          handleCustomFormChange('address', data.roadAddress || data.jibunAddress);
        },
      }).open();
    }
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-4">배송지 정보</h3>

      {/* 저장된 배송지 목록 */}
      {!isCustom && (
        <div className="space-y-3 mb-4">
          {isLoading ? (
            <div className="text-sm text-gray-500">배송지 로딩중...</div>
          ) : addresses && addresses.length > 0 ? (
            <>
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                    value?.address === address.address
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="sr-only"
                    checked={value?.address === address.address}
                    onChange={() => handleSelectAddress(address)}
                  />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{address.name}</span>
                        {address.isDefault && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                            기본
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{address.recipientName}</p>
                      <p className="text-sm text-gray-500">{address.phone}</p>
                      <p className="text-sm text-gray-500">
                        [{address.zipCode}] {address.address}
                        {address.addressDetail && `, ${address.addressDetail}`}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-500">저장된 배송지가 없습니다.</p>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsCustom(true)}
            className="w-full"
          >
            새 배송지 입력
          </Button>
        </div>
      )}

      {/* 새 배송지 입력 폼 */}
      {isCustom && (
        <div className="space-y-4">
          {addresses && addresses.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCustom(false)}
            >
              저장된 배송지 선택
            </Button>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">수령인</label>
            <Input
              value={customForm.recipientName}
              onChange={(e) => handleCustomFormChange('recipientName', e.target.value)}
              placeholder="수령인 이름"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
            <Input
              value={customForm.phone}
              onChange={(e) => handleCustomFormChange('phone', e.target.value)}
              placeholder="010-0000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={customForm.zipCode}
                readOnly
                placeholder="우편번호"
                className="w-32 bg-gray-50"
              />
              <Button type="button" variant="outline" onClick={handleAddressSearch}>
                주소 검색
              </Button>
            </div>
            <Input
              value={customForm.address}
              readOnly
              placeholder="기본 주소"
              className="bg-gray-50 mb-2"
            />
            <Input
              value={customForm.addressDetail || ''}
              onChange={(e) => handleCustomFormChange('addressDetail', e.target.value)}
              placeholder="상세 주소 (선택)"
            />
          </div>
        </div>
      )}

      {/* 배송 메모 */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">배송 메모 (선택)</label>
        <Input
          value={value?.memo || ''}
          onChange={(e) =>
            onChange(value ? { ...value, memo: e.target.value } : { ...customForm, memo: e.target.value })
          }
          placeholder="배송 시 요청사항을 입력해주세요"
        />
      </div>
    </Card>
  );
}

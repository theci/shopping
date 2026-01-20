'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Card } from '@/shared/components/ui';
import { useAddAddress } from '../../hooks/useAddAddress';
import { useUpdateAddress } from '../../hooks/useUpdateAddress';
import { addressSchema, type AddressFormData } from './AddressForm.schema';
import type { Address, AddressRequest } from '../../types';

interface AddressFormProps {
  address?: Address;
  onCancel?: () => void;
}

export function AddressForm({ address, onCancel }: AddressFormProps) {
  const isEditMode = !!address;

  const { mutate: addAddress, isPending: isAdding } = useAddAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();

  const isPending = isAdding || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: address
      ? {
          name: address.name,
          recipientName: address.recipientName,
          phone: address.phone,
          zipCode: address.zipCode,
          address: address.address,
          addressDetail: address.addressDetail || '',
          isDefault: address.isDefault,
        }
      : {
          name: '',
          recipientName: '',
          phone: '',
          zipCode: '',
          address: '',
          addressDetail: '',
          isDefault: false,
        },
  });

  const onSubmit = (data: AddressFormData) => {
    const request: AddressRequest = {
      name: data.name,
      recipientName: data.recipientName,
      phone: data.phone,
      zipCode: data.zipCode,
      address: data.address,
      addressDetail: data.addressDetail || undefined,
      isDefault: data.isDefault,
    };

    if (isEditMode && address) {
      updateAddress({ addressId: address.id, data: request });
    } else {
      addAddress(request);
    }
  };

  const handleAddressSearch = () => {
    // 다음 주소 검색 API 연동 (Daum Postcode API)
    if (typeof window !== 'undefined' && (window as any).daum?.Postcode) {
      new (window as any).daum.Postcode({
        oncomplete: (data: any) => {
          setValue('zipCode', data.zonecode);
          setValue('address', data.roadAddress || data.jibunAddress);
        },
      }).open();
    } else {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">
        {isEditMode ? '배송지 수정' : '새 배송지 추가'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 배송지명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            배송지명 *
          </label>
          <Input
            type="text"
            placeholder="예: 집, 회사"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        {/* 수령인 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            수령인 *
          </label>
          <Input
            type="text"
            placeholder="수령인 이름"
            error={errors.recipientName?.message}
            {...register('recipientName')}
          />
        </div>

        {/* 휴대폰 번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            휴대폰 번호 *
          </label>
          <Input
            type="tel"
            placeholder="010-0000-0000"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        {/* 주소 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            주소 *
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              placeholder="우편번호"
              readOnly
              className="w-32 bg-gray-50"
              error={errors.zipCode?.message}
              {...register('zipCode')}
            />
            <Button type="button" variant="outline" onClick={handleAddressSearch}>
              주소 검색
            </Button>
          </div>
          <Input
            type="text"
            placeholder="기본 주소"
            readOnly
            className="bg-gray-50 mb-2"
            error={errors.address?.message}
            {...register('address')}
          />
          <Input
            type="text"
            placeholder="상세 주소 (선택)"
            error={errors.addressDetail?.message}
            {...register('addressDetail')}
          />
        </div>

        {/* 기본 배송지 설정 */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('isDefault')}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">기본 배송지로 설정</span>
          </label>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
          )}
          <Button type="submit" isLoading={isPending}>
            {isEditMode ? '수정하기' : '추가하기'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

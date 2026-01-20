'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card } from '@/shared/components/ui';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import type { Customer, UpdateProfileRequest } from '../../types';

const profileSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다.').max(50, '이름은 50자 이하여야 합니다.'),
  phone: z
    .string()
    .regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, '올바른 휴대폰 번호를 입력하세요.')
    .optional()
    .or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  customer: Customer;
}

export function ProfileForm({ customer }: ProfileFormProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: customer.name,
      phone: customer.phone || '',
      birthDate: customer.birthDate || '',
      gender: customer.gender,
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const request: UpdateProfileRequest = {
      name: data.name,
      phone: data.phone || undefined,
      birthDate: data.birthDate || undefined,
      gender: data.gender,
    };
    updateProfile(request);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">기본 정보</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 이메일 (읽기 전용) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          <Input
            type="email"
            value={customer.email}
            disabled
            className="bg-gray-50"
          />
          <p className="mt-1 text-xs text-gray-500">이메일은 변경할 수 없습니다.</p>
        </div>

        {/* 이름 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
          <Input
            type="text"
            placeholder="이름을 입력하세요"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        {/* 휴대폰 번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">휴대폰 번호</label>
          <Input
            type="tel"
            placeholder="010-0000-0000"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        {/* 생년월일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
          <Input
            type="date"
            error={errors.birthDate?.message}
            {...register('birthDate')}
          />
        </div>

        {/* 성별 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
          <div className="flex gap-4">
            {[
              { value: 'MALE', label: '남성' },
              { value: 'FEMALE', label: '여성' },
              { value: 'OTHER', label: '기타' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={option.value}
                  {...register('gender')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={!isDirty || isPending}
            isLoading={isPending}
          >
            저장하기
          </Button>
        </div>
      </form>
    </Card>
  );
}

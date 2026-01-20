'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card } from '@/shared/components/ui';
import { useChangePassword } from '../../hooks/useChangePassword';

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력하세요.'),
    newPassword: z
      .string()
      .min(8, '새 비밀번호는 8자 이상이어야 합니다.')
      .max(50, '새 비밀번호는 50자 이하여야 합니다.')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        '영문, 숫자, 특수문자를 포함해야 합니다.'
      ),
    confirmPassword: z.string().min(1, '새 비밀번호 확인을 입력하세요.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '새 비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

export function PasswordChangeForm() {
  const { mutate: changePassword, isPending, isSuccess } = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: PasswordChangeFormData) => {
    changePassword(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">비밀번호 변경</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 현재 비밀번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            현재 비밀번호 *
          </label>
          <Input
            type="password"
            placeholder="현재 비밀번호를 입력하세요"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
        </div>

        {/* 새 비밀번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            새 비밀번호 *
          </label>
          <Input
            type="password"
            placeholder="새 비밀번호를 입력하세요"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <p className="mt-1 text-xs text-gray-500">
            8자 이상, 영문/숫자/특수문자 포함
          </p>
        </div>

        {/* 새 비밀번호 확인 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            새 비밀번호 확인 *
          </label>
          <Input
            type="password"
            placeholder="새 비밀번호를 다시 입력하세요"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        {/* 성공 메시지 */}
        {isSuccess && (
          <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg">
            비밀번호가 성공적으로 변경되었습니다.
          </div>
        )}

        {/* 제출 버튼 */}
        <div className="pt-4">
          <Button type="submit" isLoading={isPending}>
            비밀번호 변경
          </Button>
        </div>
      </form>
    </Card>
  );
}

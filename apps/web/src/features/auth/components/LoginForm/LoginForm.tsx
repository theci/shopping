'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';
import { useLogin } from '../../hooks';
import { isValidEmail } from '@/shared/utils/validation';
import { SocialLoginButtons } from '../SocialLoginButtons';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드 에러 제거
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    login(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          type="email"
          name="email"
          label="이메일"
          placeholder="이메일을 입력하세요"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<Mail className="w-5 h-5" />}
          autoComplete="email"
        />
      </div>

      <div>
        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" fullWidth isLoading={isPending} size="lg">
        로그인
      </Button>

      <SocialLoginButtons className="mt-6" />

      <div className="text-center text-sm text-gray-600">
        아직 계정이 없으신가요?{' '}
        <Link
          href="/register"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          회원가입
        </Link>
      </div>
    </form>
  );
}

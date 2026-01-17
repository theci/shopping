'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';
import { useRegister } from '../../hooks';
import { isValidEmail, isValidPassword, isValidPhoneNumber } from '@/shared/utils/validation';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phoneNumber?: string;
}

export function RegisterForm() {
  const { mutate: register, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.';
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 이름 검증
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다.';
    }

    // 전화번호 검증 (선택)
    if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = '올바른 전화번호 형식이 아닙니다.';
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

    register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phoneNumber: formData.phoneNumber || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          type="text"
          name="name"
          label="이름"
          placeholder="이름을 입력하세요"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          leftIcon={<User className="w-5 h-5" />}
          autoComplete="name"
        />
      </div>

      <div>
        <Input
          type="tel"
          name="phoneNumber"
          label="전화번호 (선택)"
          placeholder="01012345678"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
          leftIcon={<Phone className="w-5 h-5" />}
          autoComplete="tel"
        />
      </div>

      <div>
        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          label="비밀번호"
          placeholder="8자 이상, 영문+숫자"
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
          autoComplete="new-password"
        />
      </div>

      <div>
        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" fullWidth isLoading={isPending} size="lg">
        회원가입
      </Button>

      <div className="text-center text-sm text-gray-600">
        이미 계정이 있으신가요?{' '}
        <Link
          href="/login"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          로그인
        </Link>
      </div>
    </form>
  );
}

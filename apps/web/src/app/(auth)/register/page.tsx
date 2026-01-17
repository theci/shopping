import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth';

export const metadata: Metadata = {
  title: '회원가입',
  description: '새 계정을 만드세요',
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
        <p className="mt-2 text-gray-600">새 계정을 만들어 시작하세요</p>
      </div>
      <RegisterForm />
    </div>
  );
}

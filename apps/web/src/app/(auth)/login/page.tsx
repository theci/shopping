import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth';

export const metadata: Metadata = {
  title: '로그인',
  description: '계정에 로그인하세요',
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
        <p className="mt-2 text-gray-600">계정에 로그인하세요</p>
      </div>
      <LoginForm />
    </div>
  );
}

'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PasswordChangeForm } from '@/features/customer/components';

export default function PasswordPage() {
  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link
        href="/mypage"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="w-4 h-4" />
        마이페이지
      </Link>

      {/* 비밀번호 변경 폼 */}
      <PasswordChangeForm />
    </div>
  );
}

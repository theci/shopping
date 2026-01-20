'use client';

import Link from 'next/link';
import { ChevronRight, Package, MapPin, Edit2 } from 'lucide-react';
import { Card, Skeleton } from '@/shared/components/ui';
import { useCustomer } from '@/features/customer/hooks';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function MypagePage() {
  const { customer } = useAuthStore();
  const { data: customerData, isLoading } = useCustomer();

  const displayCustomer = customerData || customer;

  return (
    <div className="space-y-6">
      {/* 프로필 요약 */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                `${displayCustomer?.name}님`
              )}
            </h2>
            <p className="text-gray-500">
              {isLoading ? (
                <Skeleton className="h-5 w-40 mt-1" />
              ) : (
                displayCustomer?.email
              )}
            </p>
          </div>
          <Link
            href="/mypage/profile"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
          >
            <Edit2 className="w-4 h-4" />
            프로필 수정
          </Link>
        </div>
      </Card>

      {/* 퀵 메뉴 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/mypage/orders">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">주문 내역</h3>
                  <p className="text-sm text-gray-500">주문 및 배송 조회</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </Link>

        <Link href="/mypage/addresses">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">배송지 관리</h3>
                  <p className="text-sm text-gray-500">배송지 추가/수정</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </Link>
      </div>

      {/* 계정 정보 */}
      <Card className="p-6">
        <h3 className="font-medium text-gray-900 mb-4">계정 정보</h3>
        <dl className="space-y-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">이메일</dt>
            <dd className="text-gray-900">
              {isLoading ? <Skeleton className="h-4 w-40" /> : displayCustomer?.email}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">이름</dt>
            <dd className="text-gray-900">
              {isLoading ? <Skeleton className="h-4 w-20" /> : displayCustomer?.name}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">휴대폰</dt>
            <dd className="text-gray-900">
              {isLoading ? (
                <Skeleton className="h-4 w-28" />
              ) : (
                (displayCustomer as { phone?: string; phoneNumber?: string })?.phone ||
                (displayCustomer as { phone?: string; phoneNumber?: string })?.phoneNumber ||
                '-'
              )}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">가입일</dt>
            <dd className="text-gray-900">
              {isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : displayCustomer?.createdAt ? (
                new Date(displayCustomer.createdAt).toLocaleDateString('ko-KR')
              ) : (
                '-'
              )}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

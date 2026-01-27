'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/shared/components/layout';
import { api } from '@/lib/api/client';

interface Coupon {
  id: number;
  code: string;
  name: string;
  couponType: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  validFrom: string;
  validUntil: string;
  totalQuantity: number | null;
  issuedQuantity: number;
  active: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await api.get<ApiResponse<Coupon[]>>('/api/v1/coupons');
        setCoupons(response.data || []);
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
        // Mock data as fallback
        setCoupons([
          {
            id: 1,
            code: 'WELCOME10',
            name: '신규 가입 10% 할인',
            couponType: 'GENERAL',
            discountType: 'PERCENTAGE',
            discountValue: 10,
            minOrderAmount: 30000,
            maxDiscountAmount: 10000,
            validFrom: '2024-01-01T00:00:00',
            validUntil: '2025-12-31T23:59:59',
            totalQuantity: 10000,
            issuedQuantity: 150,
            active: true,
          },
          {
            id: 2,
            code: 'SUMMER2024',
            name: '여름 시즌 15% 할인',
            couponType: 'GENERAL',
            discountType: 'PERCENTAGE',
            discountValue: 15,
            minOrderAmount: 50000,
            maxDiscountAmount: 20000,
            validFrom: '2024-06-01T00:00:00',
            validUntil: '2024-08-31T23:59:59',
            totalQuantity: 5000,
            issuedQuantity: 2300,
            active: true,
          },
          {
            id: 3,
            code: 'FLAT5000',
            name: '5,000원 할인',
            couponType: 'GENERAL',
            discountType: 'FIXED_AMOUNT',
            discountValue: 5000,
            minOrderAmount: 30000,
            maxDiscountAmount: null,
            validFrom: '2024-01-01T00:00:00',
            validUntil: '2025-12-31T23:59:59',
            totalQuantity: null,
            issuedQuantity: 890,
            active: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === 'PERCENTAGE') {
      return `${coupon.discountValue}%`;
    }
    return `${coupon.discountValue.toLocaleString()}원`;
  };

  return (
    <>
      <Header title="쿠폰 관리" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">
              총 {coupons.length}개의 쿠폰
            </p>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            쿠폰 등록
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  쿠폰 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  할인
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용 조건
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  유효 기간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  발급 현황
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    등록된 쿠폰이 없습니다.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{coupon.name}</div>
                        <div className="text-sm text-gray-500 font-mono">{coupon.code}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-purple-600">
                        {formatDiscount(coupon)}
                      </span>
                      {coupon.maxDiscountAmount && (
                        <div className="text-xs text-gray-500">
                          최대 {coupon.maxDiscountAmount.toLocaleString()}원
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {coupon.minOrderAmount.toLocaleString()}원 이상
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(coupon.validFrom)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ~ {formatDate(coupon.validUntil)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {coupon.issuedQuantity.toLocaleString()}
                        {coupon.totalQuantity && (
                          <span className="text-gray-500">
                            {' '}/ {coupon.totalQuantity.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {coupon.totalQuantity && (
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-purple-600 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                (coupon.issuedQuantity / coupon.totalQuantity) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          coupon.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {coupon.active ? '활성' : '비활성'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

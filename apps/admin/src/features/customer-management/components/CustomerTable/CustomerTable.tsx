'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Search } from 'lucide-react';
import { Button, Input, Card, Badge, Spinner } from '@/shared/components/ui';
import { Pagination } from '@/shared/components/ui/Pagination';
import { formatPrice, formatDateTime } from '@/shared/utils/format';
import { useAdminCustomers } from '../../hooks';
import { CUSTOMER_STATUS_MAP } from '../../types';
import type { CustomerStatus, CustomerSearchParams } from '../../types';

const PAGE_SIZE = 20;

export function CustomerTable() {
  const [filters, setFilters] = useState<CustomerSearchParams>({
    page: 0,
    size: PAGE_SIZE,
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  const { data, isLoading, error } = useAdminCustomers(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, keyword: searchKeyword, page: 0 }));
  };

  const handleStatusFilter = (status: CustomerStatus | '') => {
    setFilters((prev) => ({
      ...prev,
      status: status || undefined,
      page: 0,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (error) {
    return (
      <Card>
        <div className="p-6 text-center text-red-500">
          고객 목록을 불러오는데 실패했습니다.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 검색 */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <Input
              placeholder="이름, 이메일, 연락처 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
              className="flex-1"
            />
            <Button type="submit">검색</Button>
          </form>

          {/* 상태 필터 */}
          <select
            value={filters.status || ''}
            onChange={(e) => handleStatusFilter(e.target.value as CustomerStatus | '')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">전체 상태</option>
            {Object.entries(CUSTOMER_STATUS_MAP).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* 고객 테이블 */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  고객
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  연락처
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  상태
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  주문수
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  총 구매금액
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  가입일
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  최근 로그인
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Spinner size="lg" />
                  </td>
                </tr>
              ) : !data?.content?.length ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    고객이 없습니다.
                  </td>
                </tr>
              ) : (
                data.content.map((customer) => {
                  const statusInfo = CUSTOMER_STATUS_MAP[customer.status];
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {customer.phone || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {customer.orderCount}건
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {formatPrice(customer.totalSpent)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDateTime(customer.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {customer.lastLoginAt
                          ? formatDateTime(customer.lastLoginAt)
                          : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          <Link href={`/customers/${customer.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {data && data.totalPages > 1 && (
          <div className="px-4 py-3 border-t">
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

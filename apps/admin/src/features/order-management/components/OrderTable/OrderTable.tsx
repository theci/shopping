'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Search } from 'lucide-react';
import { Button, Input, Card, Spinner } from '@/shared/components/ui';
import { Pagination } from '@/shared/components/ui/Pagination';
import { formatPrice, formatDateTime } from '@/shared/utils/format';
import { useAdminOrders, useUpdateOrderStatus } from '../../hooks';
import { OrderStatusBadge } from '../OrderStatusBadge';
import { ORDER_STATUS_MAP, PAYMENT_METHOD_MAP } from '../../types';
import type { OrderStatus, OrderSearchParams } from '../../types';

const PAGE_SIZE = 20;

export function OrderTable() {
  const [filters, setFilters] = useState<OrderSearchParams>({
    page: 0,
    size: PAGE_SIZE,
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  const { data, isLoading, error } = useAdminOrders(filters);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, keyword: searchKeyword, page: 0 }));
  };

  const handleStatusFilter = (status: OrderStatus | '') => {
    setFilters((prev) => ({
      ...prev,
      status: status || undefined,
      page: 0,
    }));
  };

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    updateStatus({ orderId, data: { status: newStatus } });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (error) {
    return (
      <Card>
        <div className="p-6 text-center text-red-500">
          주문 목록을 불러오는데 실패했습니다.
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
              placeholder="주문번호, 고객명, 이메일 검색"
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
            onChange={(e) => handleStatusFilter(e.target.value as OrderStatus | '')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">전체 상태</option>
            {Object.entries(ORDER_STATUS_MAP).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* 주문 테이블 */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  주문번호
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  고객
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  상품수
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  결제금액
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  결제수단
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  상태
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  주문일시
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
                    주문이 없습니다.
                  </td>
                </tr>
              ) : (
                data.content.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-medium text-purple-600 hover:text-purple-800"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {order.itemCount}개
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {order.paymentMethod ? PAYMENT_METHOD_MAP[order.paymentMethod] : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {/* 빠른 상태 변경 */}
                        {order.status === 'PAID' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'PREPARING')}
                            disabled={isUpdating}
                          >
                            준비
                          </Button>
                        )}
                        {order.status === 'PREPARING' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'SHIPPED')}
                            disabled={isUpdating}
                          >
                            발송
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
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

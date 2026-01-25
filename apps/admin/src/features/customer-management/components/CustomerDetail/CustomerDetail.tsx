'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Phone, MapPin, ShoppingBag, Calendar } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Spinner } from '@/shared/components/ui';
import { Pagination } from '@/shared/components/ui/Pagination';
import { formatPrice, formatDateTime } from '@/shared/utils/format';
import { useCustomerOrders, useUpdateCustomerStatus } from '../../hooks';
import { CUSTOMER_STATUS_MAP } from '../../types';
import type { Customer, CustomerStatus } from '../../types';

interface CustomerDetailProps {
  customer: Customer;
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const [orderPage, setOrderPage] = useState(0);
  const { data: ordersData, isLoading: isLoadingOrders } = useCustomerOrders(customer.id, {
    page: orderPage,
    size: 10,
  });
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateCustomerStatus();

  const statusInfo = CUSTOMER_STATUS_MAP[customer.status];

  const handleStatusChange = (newStatus: CustomerStatus) => {
    if (newStatus === 'SUSPENDED') {
      const reason = prompt('정지 사유를 입력하세요:');
      if (reason === null) return;
      updateStatus({ customerId: customer.id, data: { status: newStatus, reason } });
    } else {
      updateStatus({ customerId: customer.id, data: { status: newStatus } });
    }
  };

  return (
    <div className="space-y-6">
      {/* 고객 기본 정보 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{customer.name}</h2>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {customer.status === 'ACTIVE' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleStatusChange('SUSPENDED')}
                  disabled={isUpdatingStatus}
                >
                  계정 정지
                </Button>
              )}
              {customer.status === 'SUSPENDED' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleStatusChange('ACTIVE')}
                  disabled={isUpdatingStatus}
                >
                  정지 해제
                </Button>
              )}
              {customer.status === 'INACTIVE' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleStatusChange('ACTIVE')}
                  disabled={isUpdatingStatus}
                >
                  휴면 해제
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">이메일</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">연락처</p>
                <p className="font-medium">{customer.phone || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">총 주문</p>
                <p className="font-medium">{customer.orderCount}건</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">가입일</p>
                <p className="font-medium">{formatDateTime(customer.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-sm text-purple-600">총 구매금액</p>
              <p className="text-2xl font-bold text-purple-700">
                {formatPrice(customer.totalSpent)}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-600">총 주문수</p>
              <p className="text-2xl font-bold text-blue-700">{customer.orderCount}건</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-green-600">평균 주문금액</p>
              <p className="text-2xl font-bold text-green-700">
                {customer.orderCount > 0
                  ? formatPrice(Math.round(customer.totalSpent / customer.orderCount))
                  : formatPrice(0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 배송지 목록 */}
      {customer.addresses && customer.addresses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              배송지 목록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customer.addresses.map((address) => (
                <div
                  key={address.id}
                  className="p-4 border rounded-lg flex items-start justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{address.recipientName}</span>
                      {address.isDefault && (
                        <Badge variant="primary">기본</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                    <p className="text-sm text-gray-600">
                      [{address.zipCode}] {address.address}
                      {address.addressDetail && ` ${address.addressDetail}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 주문 내역 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            주문 내역
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingOrders ? (
            <div className="py-12 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : !ordersData?.content?.length ? (
            <div className="py-12 text-center text-gray-500">
              주문 내역이 없습니다.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        주문번호
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        상태
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        상품수
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        결제금액
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        주문일시
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {ordersData.content.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-purple-600 hover:text-purple-800 font-medium"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <Badge>{order.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {order.itemCount}개
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDateTime(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {ordersData.totalPages > 1 && (
                <div className="mt-4 pt-4 border-t">
                  <Pagination
                    currentPage={ordersData.page}
                    totalPages={ordersData.totalPages}
                    onPageChange={setOrderPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

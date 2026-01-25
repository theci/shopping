'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package, Truck, User, MapPin, CreditCard, FileText } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from '@/shared/components/ui';
import { formatPrice, formatDateTime } from '@/shared/utils/format';
import { useUpdateOrderStatus, useUpdateShipping, useUpdateAdminMemo } from '../../hooks';
import { OrderStatusBadge } from '../OrderStatusBadge';
import { ORDER_STATUS_MAP, PAYMENT_METHOD_MAP, SHIPPING_COMPANIES } from '../../types';
import type { Order, OrderStatus } from '../../types';

interface OrderDetailProps {
  order: Order;
}

export function OrderDetail({ order }: OrderDetailProps) {
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [trackingCompany, setTrackingCompany] = useState(order.trackingCompany || '');
  const [adminMemo, setAdminMemo] = useState(order.adminMemo || '');

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateOrderStatus();
  const { mutate: updateShipping, isPending: isUpdatingShipping } = useUpdateShipping();
  const { mutate: updateMemo, isPending: isUpdatingMemo } = useUpdateAdminMemo();

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (newStatus === 'CANCELLED') {
      const reason = prompt('취소 사유를 입력하세요:');
      if (reason === null) return;
      updateStatus({ orderId: order.id, data: { status: newStatus, reason } });
    } else {
      updateStatus({ orderId: order.id, data: { status: newStatus } });
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber || !trackingCompany) return;
    updateShipping({
      orderId: order.id,
      data: { trackingNumber, trackingCompany },
    });
  };

  const handleMemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMemo({ orderId: order.id, data: { memo: adminMemo } });
  };

  // 다음 상태 버튼 표시 여부
  const getNextStatusActions = (): { status: OrderStatus; label: string }[] => {
    switch (order.status) {
      case 'PENDING':
        return [{ status: 'CANCELLED', label: '주문 취소' }];
      case 'PAID':
        return [
          { status: 'PREPARING', label: '상품 준비' },
          { status: 'CANCELLED', label: '주문 취소' },
        ];
      case 'PREPARING':
        return [
          { status: 'SHIPPED', label: '배송 시작' },
          { status: 'CANCELLED', label: '주문 취소' },
        ];
      case 'SHIPPED':
        return [{ status: 'DELIVERED', label: '배송 완료' }];
      case 'DELIVERED':
        return [{ status: 'CONFIRMED', label: '구매 확정' }];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* 주문 상태 및 액션 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>주문 #{order.orderNumber}</CardTitle>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex gap-2">
              {getNextStatusActions().map(({ status, label }) => (
                <Button
                  key={status}
                  variant={status === 'CANCELLED' ? 'danger' : 'primary'}
                  size="sm"
                  onClick={() => handleStatusChange(status)}
                  disabled={isUpdatingStatus}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">주문일시</p>
              <p className="font-medium">{formatDateTime(order.createdAt)}</p>
            </div>
            {order.paidAt && (
              <div>
                <p className="text-gray-500">결제일시</p>
                <p className="font-medium">{formatDateTime(order.paidAt)}</p>
              </div>
            )}
            {order.shippedAt && (
              <div>
                <p className="text-gray-500">발송일시</p>
                <p className="font-medium">{formatDateTime(order.shippedAt)}</p>
              </div>
            )}
            {order.deliveredAt && (
              <div>
                <p className="text-gray-500">배송완료</p>
                <p className="font-medium">{formatDateTime(order.deliveredAt)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 주문 상품 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              주문 상품
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    {item.optionName && (
                      <p className="text-sm text-gray-500">{item.optionName}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.price)} x {item.quantity}개
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 금액 요약 */}
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">상품금액</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">배송비</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">할인</span>
                  <span className="text-red-500">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>총 결제금액</span>
                <span className="text-purple-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 사이드 정보 */}
        <div className="space-y-6">
          {/* 고객 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="w-4 h-4" />
                고객 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><span className="text-gray-500">이름:</span> {order.customer.name}</p>
              <p><span className="text-gray-500">이메일:</span> {order.customer.email}</p>
              {order.customer.phone && (
                <p><span className="text-gray-500">연락처:</span> {order.customer.phone}</p>
              )}
            </CardContent>
          </Card>

          {/* 배송 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="w-4 h-4" />
                배송 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><span className="text-gray-500">수령인:</span> {order.shippingInfo.recipientName}</p>
              <p><span className="text-gray-500">연락처:</span> {order.shippingInfo.phone}</p>
              <p>
                <span className="text-gray-500">주소:</span><br />
                [{order.shippingInfo.zipCode}] {order.shippingInfo.address}
                {order.shippingInfo.addressDetail && `, ${order.shippingInfo.addressDetail}`}
              </p>
              {order.shippingInfo.memo && (
                <p><span className="text-gray-500">배송메모:</span> {order.shippingInfo.memo}</p>
              )}
            </CardContent>
          </Card>

          {/* 결제 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="w-4 h-4" />
                결제 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <span className="text-gray-500">결제수단:</span>{' '}
                {order.paymentMethod ? PAYMENT_METHOD_MAP[order.paymentMethod] : '-'}
              </p>
              <p>
                <span className="text-gray-500">결제금액:</span>{' '}
                <span className="font-medium">{formatPrice(order.totalAmount)}</span>
              </p>
            </CardContent>
          </Card>

          {/* 운송장 입력 */}
          {(order.status === 'PREPARING' || order.status === 'SHIPPED') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Truck className="w-4 h-4" />
                  운송장 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="space-y-3">
                  <select
                    value={trackingCompany}
                    onChange={(e) => setTrackingCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">택배사 선택</option>
                    {SHIPPING_COMPANIES.map((company) => (
                      <option key={company.value} value={company.value}>
                        {company.label}
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder="운송장 번호"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    size="sm"
                    disabled={!trackingNumber || !trackingCompany || isUpdatingShipping}
                    isLoading={isUpdatingShipping}
                  >
                    저장
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* 관리자 메모 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-4 h-4" />
                관리자 메모
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMemoSubmit} className="space-y-3">
                <textarea
                  value={adminMemo}
                  onChange={(e) => setAdminMemo(e.target.value)}
                  placeholder="내부 메모를 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  rows={3}
                />
                <Button
                  type="submit"
                  fullWidth
                  size="sm"
                  variant="outline"
                  disabled={isUpdatingMemo}
                  isLoading={isUpdatingMemo}
                >
                  메모 저장
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 취소 사유 */}
      {order.status === 'CANCELLED' && order.cancelReason && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-sm text-red-600">
              <strong>취소 사유:</strong> {order.cancelReason}
            </p>
            {order.cancelledAt && (
              <p className="text-sm text-red-500 mt-1">
                취소일시: {formatDateTime(order.cancelledAt)}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

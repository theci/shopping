'use client';

import { useState } from 'react';
import { ShippingInfo } from './ShippingInfo';
import { PaymentMethod } from './PaymentMethod';
import { OrderSummary } from './OrderSummary';
import type { CartItem } from '@/features/cart/types';
import type { ShippingInfo as ShippingInfoType, PaymentMethod as PaymentMethodType, OrderCreateRequest } from '../../types';

interface OrderFormProps {
  items: CartItem[];
  onSubmit: (data: OrderCreateRequest) => void;
  isSubmitting?: boolean;
}

const FREE_SHIPPING_THRESHOLD = 50000;
const SHIPPING_FEE = 3000;

export function OrderForm({ items, onSubmit, isSubmitting }: OrderFormProps) {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfoType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(null);

  // 금액 계산
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const discount = 0; // TODO: 쿠폰 적용 시 구현
  const totalAmount = subtotal + shippingFee - discount;

  // 유효성 검사
  const isValid =
    shippingInfo !== null &&
    shippingInfo.recipientName !== '' &&
    shippingInfo.phone !== '' &&
    shippingInfo.zipCode !== '' &&
    shippingInfo.address !== '' &&
    paymentMethod !== null;

  const handleSubmit = () => {
    if (!isValid || !shippingInfo || !paymentMethod) return;

    const orderData: OrderCreateRequest = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shippingInfo,
      paymentMethod,
    };

    onSubmit(orderData);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* 왼쪽: 입력 폼 */}
      <div className="flex-1 space-y-6">
        {/* 배송지 정보 */}
        <ShippingInfo value={shippingInfo} onChange={setShippingInfo} />

        {/* 결제 수단 */}
        <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
      </div>

      {/* 오른쪽: 주문 요약 */}
      <div className="lg:w-96">
        <OrderSummary
          items={items}
          subtotal={subtotal}
          shippingFee={shippingFee}
          discount={discount}
          totalAmount={totalAmount}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isValid={isValid}
        />
      </div>
    </div>
  );
}

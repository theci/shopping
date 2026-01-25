'use client';

import { Header } from '@/shared/components/layout';
import { OrderTable } from '@/features/order-management';

export default function OrdersPage() {
  return (
    <>
      <Header title="주문 관리" />
      <div className="p-6">
        <OrderTable />
      </div>
    </>
  );
}

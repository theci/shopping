'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/shared/components/layout';
import { Button, Spinner } from '@/shared/components/ui';
import { OrderDetail, useAdminOrder } from '@/features/order-management';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const orderId = parseInt(id, 10);
  const { data: order, isLoading, error } = useAdminOrder(orderId);

  if (isLoading) {
    return (
      <>
        <Header title="주문 상세" />
        <div className="p-6 flex justify-center">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header title="주문 상세" />
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">주문을 불러오는데 실패했습니다.</p>
            <Link href="/orders">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                목록으로
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="주문 상세"
        actions={
          <Link href="/orders">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
          </Link>
        }
      />
      <div className="p-6">
        <OrderDetail order={order} />
      </div>
    </>
  );
}

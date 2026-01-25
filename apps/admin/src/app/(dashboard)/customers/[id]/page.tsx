'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/shared/components/layout';
import { Button, Spinner } from '@/shared/components/ui';
import { CustomerDetail, useAdminCustomer } from '@/features/customer-management';

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = use(params);
  const customerId = parseInt(id, 10);
  const { data: customer, isLoading, error } = useAdminCustomer(customerId);

  if (isLoading) {
    return (
      <>
        <Header title="고객 상세" />
        <div className="p-6 flex justify-center">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (error || !customer) {
    return (
      <>
        <Header title="고객 상세" />
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">고객 정보를 불러오는데 실패했습니다.</p>
            <Link href="/customers">
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
        title="고객 상세"
        actions={
          <Link href="/customers">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
          </Link>
        }
      />
      <div className="p-6">
        <CustomerDetail customer={customer} />
      </div>
    </>
  );
}

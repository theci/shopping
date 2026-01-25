'use client';

import { Header } from '@/shared/components/layout';
import { CustomerTable } from '@/features/customer-management';

export default function CustomersPage() {
  return (
    <>
      <Header title="고객 관리" />
      <div className="p-6">
        <CustomerTable />
      </div>
    </>
  );
}

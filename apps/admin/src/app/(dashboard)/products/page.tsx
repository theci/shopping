'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/shared/components/layout';
import { Button } from '@/shared/components/ui';
import { ProductTable, useAdminProducts } from '@/features/product-management';
import type { ProductSearchParams } from '@/features/product-management';

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductSearchParams>({
    page: 0,
    size: 20,
  });

  const { data, isLoading } = useAdminProducts(filters);

  return (
    <>
      <Header title="상품 관리" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">
              총 {data?.totalElements || 0}개의 상품
            </p>
          </div>
          <Link href="/products/new">
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              상품 등록
            </Button>
          </Link>
        </div>

        <ProductTable
          products={data?.content || []}
          isLoading={isLoading}
          filters={filters}
          onFilterChange={setFilters}
          totalPages={data?.totalPages || 0}
          currentPage={data?.page || 0}
        />
      </div>
    </>
  );
}

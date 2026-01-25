'use client';

import { use } from 'react';
import { Header } from '@/shared/components/layout';
import { Spinner } from '@/shared/components/ui';
import { ProductForm, useAdminProduct } from '@/features/product-management';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const productId = parseInt(id, 10);
  const { data: product, isLoading, error } = useAdminProduct(productId);

  if (isLoading) {
    return (
      <>
        <Header title="상품 수정" />
        <div className="p-6 flex justify-center">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header title="상품 수정" />
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-red-500">상품을 불러오는데 실패했습니다.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="상품 수정" />
      <div className="p-6">
        <ProductForm product={product} mode="edit" />
      </div>
    </>
  );
}

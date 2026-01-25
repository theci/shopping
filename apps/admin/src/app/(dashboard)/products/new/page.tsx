'use client';

import { Header } from '@/shared/components/layout';
import { ProductForm } from '@/features/product-management';

export default function NewProductPage() {
  return (
    <>
      <Header title="상품 등록" />
      <div className="p-6">
        <ProductForm mode="create" />
      </div>
    </>
  );
}

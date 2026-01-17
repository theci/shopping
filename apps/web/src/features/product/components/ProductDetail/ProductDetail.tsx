'use client';

import { Skeleton } from '@/shared/components/ui';
import { ProductImages } from './ProductImages';
import { ProductInfo } from './ProductInfo';
import type { ProductDetail as ProductDetailType } from '../../types';

interface ProductDetailProps {
  product: ProductDetailType;
  isLoading?: boolean;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  isAddingToCart?: boolean;
}

export function ProductDetail({
  product,
  isLoading,
  onAddToCart,
  onBuyNow,
  isAddingToCart,
}: ProductDetailProps) {
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* 이미지 영역 */}
      <div>
        <ProductImages images={product.images || []} productName={product.name} />
      </div>

      {/* 정보 영역 */}
      <div>
        <ProductInfo
          product={product}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          isAddingToCart={isAddingToCart}
        />
      </div>

      {/* 상품 설명 */}
      <div className="lg:col-span-2 border-t pt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">상품 상세</h2>
        <div className="prose prose-gray max-w-none">
          <p className="whitespace-pre-wrap text-gray-600">{product.description}</p>
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* 이미지 스켈레톤 */}
      <div className="space-y-4">
        <Skeleton className="aspect-square rounded-lg" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-20 h-20 rounded-md" />
          ))}
        </div>
      </div>

      {/* 정보 스켈레톤 */}
      <div className="space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2 py-4 border-t border-b">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
      </div>
    </div>
  );
}

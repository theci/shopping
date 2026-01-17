'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import type { ProductListItem } from '../../types';

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.stockQuantity === 0;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountRate = hasDiscount
    ? Math.round((1 - product.discountPrice! / product.price) * 100)
    : product.discountRate;

  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const primaryImage = product.images?.[0]?.imageUrl;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-white font-medium text-sm">품절</span>
          </div>
        )}

        {discountRate && discountRate > 0 && !isOutOfStock && (
          <Badge className="absolute top-2 left-2" variant="danger">
            {discountRate}%
          </Badge>
        )}
      </div>

      <div className="mt-3 space-y-1">
        {product.brand && (
          <p className="text-xs text-gray-500 truncate">{product.brand}</p>
        )}

        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="font-bold text-base">{formatPrice(displayPrice)}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {product.salesCount > 0 && (
          <p className="text-xs text-gray-400">
            {product.salesCount.toLocaleString()}개 판매
          </p>
        )}
      </div>
    </Link>
  );
}

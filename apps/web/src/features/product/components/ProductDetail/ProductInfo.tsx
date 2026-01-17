'use client';

import { Badge, Button } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import type { ProductDetail } from '../../types';

interface ProductInfoProps {
  product: ProductDetail;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  isAddingToCart?: boolean;
}

export function ProductInfo({
  product,
  onAddToCart,
  onBuyNow,
  isAddingToCart,
}: ProductInfoProps) {
  const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.stockQuantity === 0;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const discountRate = hasDiscount
    ? Math.round((1 - product.discountPrice! / product.price) * 100)
    : product.discountRate;

  return (
    <div className="space-y-6">
      {/* 카테고리 & 브랜드 */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {product.category && (
          <>
            <span>{product.category.name}</span>
            <span>·</span>
          </>
        )}
        {product.brand && <span>{product.brand}</span>}
      </div>

      {/* 상품명 */}
      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

      {/* 가격 */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {discountRate && discountRate > 0 && (
            <Badge variant="danger" className="text-lg px-2 py-1">
              {discountRate}%
            </Badge>
          )}
          <span className="text-3xl font-bold">{formatPrice(displayPrice)}</span>
        </div>
        {hasDiscount && (
          <p className="text-gray-400 line-through">{formatPrice(product.price)}</p>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="border-t border-b py-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">배송비</span>
          <span className="text-gray-900">무료배송</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">재고</span>
          <span className={isOutOfStock ? 'text-red-500' : 'text-gray-900'}>
            {isOutOfStock ? '품절' : `${product.stockQuantity}개`}
          </span>
        </div>
        {product.salesCount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">판매량</span>
            <span className="text-gray-900">{product.salesCount.toLocaleString()}개</span>
          </div>
        )}
      </div>

      {/* 상품 옵션 */}
      {product.options && product.options.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">옵션</h3>
          <div className="space-y-2">
            {product.options.map((option) => (
              <div key={option.id} className="flex justify-between text-sm">
                <span className="text-gray-500">{option.optionName}</span>
                <span className="text-gray-900">
                  {option.optionValue}
                  {option.additionalPrice > 0 && (
                    <span className="text-blue-600 ml-1">
                      (+{formatPrice(option.additionalPrice)})
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 구매 버튼 */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={onAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          isLoading={isAddingToCart}
        >
          장바구니
        </Button>
        <Button
          size="lg"
          fullWidth
          onClick={onBuyNow}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? '품절' : '바로구매'}
        </Button>
      </div>
    </div>
  );
}

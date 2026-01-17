'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import { useUpdateCartItem } from '../../hooks/useUpdateCartItem';
import { useRemoveCartItem } from '../../hooks/useRemoveCartItem';
import { useCartSelection } from '../../hooks/useCartSelection';
import type { CartItem as CartItemType, LocalCartItem } from '../../types';

interface CartItemProps {
  item: CartItemType | LocalCartItem;
  isAuthenticated: boolean;
}

export function CartItem({ item, isAuthenticated }: CartItemProps) {
  const { updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { removeItem, isPending: isRemoving } = useRemoveCartItem();
  const { toggleSelection } = useCartSelection();

  const itemId = 'id' in item ? item.id : 0;
  const productId = item.productId;
  const isSelected = item.selected;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.stockQuantity) return;
    updateItem({ itemId, productId, quantity: newQuantity });
  };

  const handleRemove = () => {
    removeItem({ itemId, productId });
  };

  const handleSelectionChange = () => {
    toggleSelection({ itemId, productId, selected: !isSelected });
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200">
      {/* 선택 체크박스 */}
      <div className="flex items-start pt-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelectionChange}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>

      {/* 상품 이미지 */}
      <Link href={`/products/${productId}`} className="shrink-0">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
          {item.productImage ? (
            <Image
              src={item.productImage}
              alt={item.productName}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* 상품 정보 */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${productId}`}>
          <h3 className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2 transition-colors">
            {item.productName}
          </h3>
        </Link>
        <p className="text-lg font-bold mt-1">{formatPrice(item.price)}</p>

        {/* 수량 조절 */}
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1 || isUpdating}
            className="w-8 h-8 p-0"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.stockQuantity || isUpdating}
            className="w-8 h-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* 재고 부족 경고 */}
        {item.stockQuantity < 5 && item.stockQuantity > 0 && (
          <p className="text-xs text-orange-500 mt-1">
            재고 {item.stockQuantity}개 남음
          </p>
        )}
        {item.stockQuantity === 0 && (
          <p className="text-xs text-red-500 mt-1">품절</p>
        )}
      </div>

      {/* 소계 & 삭제 */}
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-gray-400 hover:text-red-500 p-1"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
        <p className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
      </div>
    </div>
  );
}

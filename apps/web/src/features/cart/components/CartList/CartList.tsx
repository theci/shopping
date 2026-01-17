'use client';

import { Skeleton } from '@/shared/components/ui';
import { CartItem } from './CartItem';
import { useCartSelection } from '../../hooks/useCartSelection';
import type { CartItem as CartItemType, LocalCartItem } from '../../types';

interface CartListProps {
  items: (CartItemType | LocalCartItem)[];
  isAuthenticated: boolean;
  isLoading?: boolean;
}

export function CartList({ items, isAuthenticated, isLoading }: CartListProps) {
  const { toggleAllSelection, removeSelectedItems } = useCartSelection();

  const allSelected = items.length > 0 && items.every((item) => item.selected);
  const selectedCount = items.filter((item) => item.selected).length;
  const selectedItemIds = items
    .filter((item) => item.selected && 'id' in item)
    .map((item) => (item as CartItemType).id);

  if (isLoading) {
    return <CartListSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
        <p className="text-gray-500">원하는 상품을 장바구니에 담아보세요</p>
      </div>
    );
  }

  return (
    <div>
      {/* 전체 선택 헤더 */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => toggleAllSelection(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            전체 선택 ({selectedCount}/{items.length})
          </span>
        </label>

        {selectedCount > 0 && (
          <button
            onClick={() => removeSelectedItems(selectedItemIds)}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            선택 삭제
          </button>
        )}
      </div>

      {/* 장바구니 아이템 목록 */}
      <div>
        {items.map((item) => (
          <CartItem
            key={'id' in item ? item.id : item.productId}
            item={item}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </div>
  );
}

function CartListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-4 border-b">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="w-32 h-4" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 py-4 border-b">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="w-24 h-24 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="flex flex-col items-end justify-between">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

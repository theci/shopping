'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/shared/utils/cn';
import type { Category } from '../../types';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId?: number;
  onCategorySelect?: (categoryId: number | undefined) => void;
}

export function CategoryNav({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: CategoryNavProps) {
  const searchParams = useSearchParams();

  const handleCategoryClick = (categoryId: number | undefined) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  const buildCategoryUrl = (categoryId: number | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set('categoryId', categoryId.toString());
    } else {
      params.delete('categoryId');
    }
    params.delete('page'); // 카테고리 변경 시 첫 페이지로
    return `/products?${params.toString()}`;
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-gray-900 mb-3">카테고리</h3>
      <nav className="space-y-1">
        {/* 전체 카테고리 */}
        {onCategorySelect ? (
          <button
            onClick={() => handleCategoryClick(undefined)}
            className={cn(
              'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
              !selectedCategoryId
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            전체
          </button>
        ) : (
          <Link
            href={buildCategoryUrl(undefined)}
            className={cn(
              'block px-3 py-2 rounded-lg text-sm transition-colors',
              !selectedCategoryId
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            전체
          </Link>
        )}

        {/* 카테고리 목록 */}
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={onCategorySelect}
            buildCategoryUrl={buildCategoryUrl}
          />
        ))}
      </nav>
    </div>
  );
}

interface CategoryItemProps {
  category: Category;
  selectedCategoryId?: number;
  onCategorySelect?: (categoryId: number | undefined) => void;
  buildCategoryUrl: (categoryId: number | undefined) => string;
  depth?: number;
}

function CategoryItem({
  category,
  selectedCategoryId,
  onCategorySelect,
  buildCategoryUrl,
  depth = 0,
}: CategoryItemProps) {
  const isSelected = selectedCategoryId === category.id;
  const hasChildren = category.children && category.children.length > 0;

  const content = (
    <>
      <span className="truncate">{category.name}</span>
      {category.productCount !== undefined && (
        <span className="text-gray-400 text-xs ml-auto">
          ({category.productCount})
        </span>
      )}
    </>
  );

  const className = cn(
    'flex items-center w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
    isSelected
      ? 'bg-blue-50 text-blue-700 font-medium'
      : 'text-gray-600 hover:bg-gray-50',
    depth > 0 && 'pl-6'
  );

  return (
    <>
      {onCategorySelect ? (
        <button
          onClick={() => onCategorySelect(category.id)}
          className={className}
        >
          {content}
        </button>
      ) : (
        <Link href={buildCategoryUrl(category.id)} className={className}>
          {content}
        </Link>
      )}

      {hasChildren && (
        <div className="ml-2">
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={onCategorySelect}
              buildCategoryUrl={buildCategoryUrl}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </>
  );
}

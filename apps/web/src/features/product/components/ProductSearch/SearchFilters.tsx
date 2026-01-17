'use client';

import { useState } from 'react';
import { Button, Input } from '@/shared/components/ui';
import type { ProductFilters } from '../../types';

interface SearchFiltersProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
}

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice?.toString() || '');

  const handlePriceApply = () => {
    onFilterChange({
      ...filters,
      minPrice: localMinPrice ? Number(localMinPrice) : undefined,
      maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined,
      page: 0,
    });
  };

  const handlePriceReset = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    onFilterChange({
      ...filters,
      minPrice: undefined,
      maxPrice: undefined,
      page: 0,
    });
  };

  const handleSortChange = (sort: string, direction: 'ASC' | 'DESC') => {
    onFilterChange({
      ...filters,
      sort,
      direction,
      page: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* 정렬 */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">정렬</h3>
        <div className="space-y-2">
          {[
            { label: '최신순', sort: 'createdAt', direction: 'DESC' as const },
            { label: '낮은 가격순', sort: 'price', direction: 'ASC' as const },
            { label: '높은 가격순', sort: 'price', direction: 'DESC' as const },
            { label: '판매량순', sort: 'salesCount', direction: 'DESC' as const },
            { label: '조회순', sort: 'viewCount', direction: 'DESC' as const },
          ].map((option) => (
            <label key={`${option.sort}-${option.direction}`} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                checked={filters.sort === option.sort && filters.direction === option.direction}
                onChange={() => handleSortChange(option.sort, option.direction)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 가격 필터 */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">가격</h3>
        <div className="flex items-center gap-2 mb-2">
          <Input
            type="number"
            placeholder="최소"
            value={localMinPrice}
            onChange={(e) => setLocalMinPrice(e.target.value)}
            className="text-sm"
          />
          <span className="text-gray-400">~</span>
          <Input
            type="number"
            placeholder="최대"
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={handlePriceReset}
          >
            초기화
          </Button>
          <Button
            size="sm"
            fullWidth
            onClick={handlePriceApply}
          >
            적용
          </Button>
        </div>
      </div>

      {/* 빠른 가격 필터 */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: '1만원 이하', min: 0, max: 10000 },
          { label: '1~5만원', min: 10000, max: 50000 },
          { label: '5~10만원', min: 50000, max: 100000 },
          { label: '10만원 이상', min: 100000, max: undefined },
        ].map((range) => (
          <button
            key={range.label}
            onClick={() => {
              setLocalMinPrice(range.min.toString());
              setLocalMaxPrice(range.max?.toString() || '');
              onFilterChange({
                ...filters,
                minPrice: range.min,
                maxPrice: range.max,
                page: 0,
              });
            }}
            className="px-3 py-1 text-xs border rounded-full hover:bg-gray-50 transition-colors"
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}

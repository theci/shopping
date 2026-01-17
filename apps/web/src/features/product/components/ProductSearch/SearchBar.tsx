'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks';

interface SearchBarProps {
  initialKeyword?: string;
  onSearch?: (keyword: string) => void;
  placeholder?: string;
}

export function SearchBar({
  initialKeyword = '',
  onSearch,
  placeholder = '상품을 검색하세요',
}: SearchBarProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initialKeyword);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedKeyword = keyword.trim();
      if (trimmedKeyword) {
        if (onSearch) {
          onSearch(trimmedKeyword);
        } else {
          router.push(`/products?keyword=${encodeURIComponent(trimmedKeyword)}`);
        }
      }
    },
    [keyword, onSearch, router]
  );

  const handleClear = useCallback(() => {
    setKeyword('');
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  return (
    <form onSubmit={handleSubmit} className="relative flex gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <Button type="submit">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </Button>
    </form>
  );
}

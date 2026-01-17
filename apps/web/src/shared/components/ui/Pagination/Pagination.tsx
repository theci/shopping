'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Button } from '../Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const generatePaginationRange = () => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return range(0, totalPages - 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 0);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);

    const shouldShowLeftDots = leftSiblingIndex > 1;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 0;
    const lastPageIndex = totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(0, leftItemCount - 1);
      return [...leftRange, 'dots', lastPageIndex];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount, lastPageIndex);
      return [firstPageIndex, 'dots', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, 'dots', ...middleRange, 'dots', lastPageIndex];
    }

    return [];
  };

  const paginationRange = generatePaginationRange();

  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 0}
        className="w-9 h-9 p-0"
        aria-label="이전 페이지"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === 'dots') {
          return (
            <span
              key={`dots-${index}`}
              className="w-9 h-9 flex items-center justify-center text-gray-400"
            >
              <MoreHorizontal className="w-4 h-4" />
            </span>
          );
        }

        const page = pageNumber as number;
        const isActive = page === currentPage;

        return (
          <Button
            key={page}
            variant={isActive ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
            className={cn('w-9 h-9 p-0', isActive && 'pointer-events-none')}
            aria-label={`페이지 ${page + 1}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page + 1}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
        className="w-9 h-9 p-0"
        aria-label="다음 페이지"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </nav>
  );
}

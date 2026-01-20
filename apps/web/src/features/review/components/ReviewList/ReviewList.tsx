'use client';

import { useState } from 'react';
import { Skeleton } from '@/shared/components/ui';
import { ReviewCard } from '../ReviewCard';
import { ReviewRating } from '../ReviewRating';
import { useProductReviews, useProductReviewSummary } from '../../hooks';
import { useAuthStore } from '@/features/auth';
import type { Review, ReviewSearchParams } from '../../types';

interface ReviewListProps {
  productId: number;
  onEditReview?: (review: Review) => void;
}

/**
 * 상품 리뷰 목록 컴포넌트
 */
export function ReviewList({ productId, onEditReview }: ReviewListProps) {
  const [params, setParams] = useState<ReviewSearchParams>({
    page: 0,
    size: 10,
  });
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);

  const customer = useAuthStore((state) => state.customer);

  const { data: summary, isLoading: isSummaryLoading } = useProductReviewSummary(productId);
  const { data: reviewsData, isLoading: isReviewsLoading } = useProductReviews(productId, {
    ...params,
    rating: ratingFilter,
  });

  const handleRatingFilter = (rating: number | undefined) => {
    setRatingFilter(rating);
    setParams((prev) => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  if (isSummaryLoading || isReviewsLoading) {
    return <ReviewListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* 요약 */}
      <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">
            {summary?.averageRating?.toFixed(1) ?? '0.0'}
          </div>
          <ReviewRating
            rating={summary?.averageRating ?? 0}
            size="md"
            className="justify-center mt-1"
          />
          <div className="text-sm text-gray-500 mt-1">
            {summary?.reviewCount ?? 0}개의 리뷰
          </div>
        </div>

        {/* 별점 필터 */}
        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => handleRatingFilter(undefined)}
            className={`block w-full text-left px-3 py-1 rounded text-sm ${
              ratingFilter === undefined ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
            }`}
          >
            전체 보기
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingFilter(rating)}
              className={`flex items-center gap-2 w-full px-3 py-1 rounded text-sm ${
                ratingFilter === rating ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
              }`}
            >
              <ReviewRating rating={rating} size="sm" />
              <span>{rating}점</span>
            </button>
          ))}
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div>
        {reviewsData?.content && reviewsData.content.length > 0 ? (
          <>
            {reviewsData.content.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isOwner={customer?.id === review.customerId}
                onEdit={onEditReview}
              />
            ))}

            {/* 페이지네이션 */}
            {reviewsData.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: reviewsData.totalPages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePageChange(index)}
                    className={`w-8 h-8 rounded text-sm ${
                      params.page === index
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center text-gray-500">
            아직 작성된 리뷰가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 리뷰 목록 스켈레톤
 */
export function ReviewListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg">
        <div className="text-center">
          <Skeleton className="w-16 h-10 mx-auto" />
          <Skeleton className="w-24 h-5 mx-auto mt-2" />
          <Skeleton className="w-20 h-4 mx-auto mt-1" />
        </div>
        <div className="flex-1 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="py-6 border-b">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-16 h-4" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

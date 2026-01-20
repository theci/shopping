import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { reviewApi } from '../api/reviewApi';
import type { ReviewSearchParams } from '../types';

/**
 * Review Query Keys
 */
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  productReviews: (productId: number, params?: ReviewSearchParams) =>
    [...reviewKeys.lists(), 'product', productId, params] as const,
  myReviews: (page: number, size: number) => [...reviewKeys.lists(), 'my', page, size] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: number) => [...reviewKeys.details(), id] as const,
  summaries: () => [...reviewKeys.all, 'summary'] as const,
  summary: (productId: number) => [...reviewKeys.summaries(), productId] as const,
};

/**
 * 상품별 리뷰 목록 조회 훅
 */
export const useProductReviews = (productId: number, params: ReviewSearchParams = {}) => {
  return useQuery({
    queryKey: reviewKeys.productReviews(productId, params),
    queryFn: () => reviewApi.getProductReviews(productId, params),
    staleTime: 1000 * 60 * 5, // 5분
    enabled: !!productId,
  });
};

/**
 * 상품 리뷰 무한 스크롤 훅
 */
export const useInfiniteProductReviews = (
  productId: number,
  params: Omit<ReviewSearchParams, 'page'> = {}
) => {
  return useInfiniteQuery({
    queryKey: ['reviews', 'infinite', productId, params],
    queryFn: ({ pageParam = 0 }) =>
      reviewApi.getProductReviews(productId, { ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.pageNumber + 1;
    },
    initialPageParam: 0,
    enabled: !!productId,
  });
};

/**
 * 상품 리뷰 요약 조회 훅
 */
export const useProductReviewSummary = (productId: number) => {
  return useQuery({
    queryKey: reviewKeys.summary(productId),
    queryFn: () => reviewApi.getProductReviewSummary(productId),
    staleTime: 1000 * 60 * 5,
    enabled: !!productId,
  });
};

/**
 * 내 리뷰 목록 조회 훅
 */
export const useMyReviews = (page = 0, size = 10) => {
  return useQuery({
    queryKey: reviewKeys.myReviews(page, size),
    queryFn: () => reviewApi.getMyReviews(page, size),
    staleTime: 1000 * 60,
  });
};

/**
 * 리뷰 상세 조회 훅
 */
export const useReview = (reviewId: number) => {
  return useQuery({
    queryKey: reviewKeys.detail(reviewId),
    queryFn: () => reviewApi.getReview(reviewId),
    enabled: !!reviewId,
  });
};

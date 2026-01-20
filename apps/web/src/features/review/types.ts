/**
 * Review Feature Types
 */

export type { ApiResponse, PageResponse } from '@/lib/api/types';

/**
 * 리뷰 상태
 */
export type ReviewStatus = 'VISIBLE' | 'HIDDEN' | 'REPORTED';

/**
 * 리뷰 응답
 */
export interface Review {
  id: number;
  productId: number;
  customerId: number;
  orderId: number;
  rating: number;
  content?: string;
  reviewStatus: ReviewStatus;
  reviewStatusDescription?: string;
  imageUrls: string[];
  reportCount: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 리뷰 생성 요청
 */
export interface ReviewCreateRequest {
  orderId: number;
  productId: number;
  rating: number;
  content?: string;
  imageUrls?: string[];
}

/**
 * 리뷰 수정 요청
 */
export interface ReviewUpdateRequest {
  rating: number;
  content?: string;
  imageUrls?: string[];
}

/**
 * 리뷰 검색 요청
 */
export interface ReviewSearchParams {
  rating?: number;
  page?: number;
  size?: number;
}

/**
 * 상품 리뷰 요약
 */
export interface ProductReviewSummary {
  productId: number;
  averageRating: number;
  reviewCount: number;
}

/**
 * 리뷰 신고 요청
 */
export interface ReviewReportRequest {
  reason: string;
}

/**
 * 별점 표시용 상수
 */
export const RATING_LABELS: Record<number, string> = {
  1: '별로예요',
  2: '그저 그래요',
  3: '보통이에요',
  4: '좋아요',
  5: '최고예요',
};

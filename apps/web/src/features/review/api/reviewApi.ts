import { api } from '@/lib/api/client';
import type { ApiResponse, PageResponse } from '@/lib/api/types';
import type {
  Review,
  ReviewCreateRequest,
  ReviewUpdateRequest,
  ReviewSearchParams,
  ProductReviewSummary,
  ReviewReportRequest,
} from '../types';

/**
 * Review API
 */
export const reviewApi = {
  /**
   * 리뷰 작성
   */
  createReview: async (data: ReviewCreateRequest): Promise<Review> => {
    const response = await api.post<ApiResponse<Review>>('/api/v1/reviews', data);
    return response.data;
  },

  /**
   * 리뷰 수정
   */
  updateReview: async (reviewId: number, data: ReviewUpdateRequest): Promise<Review> => {
    const response = await api.put<ApiResponse<Review>>(`/v1/reviews/${reviewId}`, data);
    return response.data;
  },

  /**
   * 리뷰 삭제
   */
  deleteReview: async (reviewId: number): Promise<void> => {
    await api.delete(`/v1/reviews/${reviewId}`);
  },

  /**
   * 리뷰 조회
   */
  getReview: async (reviewId: number): Promise<Review> => {
    const response = await api.get<ApiResponse<Review>>(`/v1/reviews/${reviewId}`);
    return response.data;
  },

  /**
   * 상품별 리뷰 목록 조회
   */
  getProductReviews: async (
    productId: number,
    params: ReviewSearchParams = {}
  ): Promise<PageResponse<Review>> => {
    const response = await api.get<ApiResponse<PageResponse<Review>>>(
      `/v1/reviews/products/${productId}`,
      {
        page: params.page ?? 0,
        size: params.size ?? 10,
        rating: params.rating,
      }
    );
    return response.data;
  },

  /**
   * 상품 리뷰 요약 조회 (평균 평점, 리뷰 수)
   */
  getProductReviewSummary: async (productId: number): Promise<ProductReviewSummary> => {
    const response = await api.get<ApiResponse<ProductReviewSummary>>(
      `/v1/reviews/products/${productId}/summary`
    );
    return response.data;
  },

  /**
   * 내 리뷰 목록 조회
   */
  getMyReviews: async (page = 0, size = 10): Promise<PageResponse<Review>> => {
    const response = await api.get<ApiResponse<PageResponse<Review>>>('/api/v1/reviews/me', {
      page,
      size,
    });
    return response.data;
  },

  /**
   * 리뷰 신고
   */
  reportReview: async (reviewId: number, data: ReviewReportRequest): Promise<Review> => {
    const response = await api.post<ApiResponse<Review>>(
      `/v1/reviews/${reviewId}/report`,
      data
    );
    return response.data;
  },
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '../api/reviewApi';
import { reviewKeys } from './useReviews';
import { productKeys } from '@/features/product/hooks/useProducts';
import { useToast } from '@/shared/hooks';
import type { ReviewCreateRequest } from '../types';

/**
 * 리뷰 생성 훅
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: ReviewCreateRequest) => reviewApi.createReview(data),
    onSuccess: (review) => {
      // 상품 리뷰 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: reviewKeys.lists(),
      });
      // 상품 리뷰 요약 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: reviewKeys.summary(review.productId),
      });
      // 상품 상세 캐시 무효화 (리뷰 수/평점 반영)
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(review.productId),
      });

      showToast({ type: 'success', message: '리뷰가 작성되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '리뷰 작성에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

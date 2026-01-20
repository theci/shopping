import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '../api/reviewApi';
import { reviewKeys } from './useReviews';
import { useToast } from '@/shared/hooks';

/**
 * 리뷰 삭제 훅
 */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({
      reviewId,
      productId,
    }: {
      reviewId: number;
      productId: number;
    }) => reviewApi.deleteReview(reviewId),
    onSuccess: (_, { productId }) => {
      // 상품 리뷰 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: reviewKeys.lists(),
      });
      // 상품 리뷰 요약 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: reviewKeys.summary(productId),
      });

      showToast({ type: 'success', message: '리뷰가 삭제되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '리뷰 삭제에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

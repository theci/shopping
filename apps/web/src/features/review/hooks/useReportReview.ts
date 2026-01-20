import { useMutation } from '@tanstack/react-query';
import { reviewApi } from '../api/reviewApi';
import { useToast } from '@/shared/hooks';
import type { ReviewReportRequest } from '../types';

/**
 * 리뷰 신고 훅
 */
export const useReportReview = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: number;
      data: ReviewReportRequest;
    }) => reviewApi.reportReview(reviewId, data),
    onSuccess: () => {
      showToast({ type: 'success', message: '신고가 접수되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '신고 접수에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

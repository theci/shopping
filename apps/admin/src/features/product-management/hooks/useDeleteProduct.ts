/**
 * 상품 삭제 Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productManagementApi } from '../api/productManagementApi';
import { productKeys } from './useAdminProducts';
import { useToast } from '@/shared/hooks';

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => productManagementApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast({ type: 'success', message: '상품이 삭제되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '상품 삭제에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

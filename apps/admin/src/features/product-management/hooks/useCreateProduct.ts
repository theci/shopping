/**
 * 상품 생성 Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { productManagementApi } from '../api/productManagementApi';
import { productKeys } from './useAdminProducts';
import { useToast } from '@/shared/hooks';
import type { ProductCreateRequest } from '../types';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: ProductCreateRequest) => productManagementApi.createProduct(data),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast({ type: 'success', message: '상품이 등록되었습니다.' });
      router.push('/products');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '상품 등록에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

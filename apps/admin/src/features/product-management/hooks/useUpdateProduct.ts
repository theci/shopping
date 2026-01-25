/**
 * 상품 수정 Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { productManagementApi } from '../api/productManagementApi';
import { productKeys } from './useAdminProducts';
import { useToast } from '@/shared/hooks';
import type { ProductUpdateRequest } from '../types';

interface UpdateProductParams {
  id: number;
  data: ProductUpdateRequest;
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: UpdateProductParams) =>
      productManagementApi.updateProduct(id, data),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(product.id) });
      showToast({ type: 'success', message: '상품이 수정되었습니다.' });
      router.push('/products');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '상품 수정에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

/**
 * 상품 상태 변경 Hook
 */
export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      productManagementApi.updateProductStatus(id, status),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(product.id) });
      showToast({ type: 'success', message: '상품 상태가 변경되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '상태 변경에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

/**
 * 재고 수정 Hook
 */
export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, stockQuantity }: { id: number; stockQuantity: number }) =>
      productManagementApi.updateStock(id, { stockQuantity }),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(product.id) });
      showToast({ type: 'success', message: '재고가 수정되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '재고 수정에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

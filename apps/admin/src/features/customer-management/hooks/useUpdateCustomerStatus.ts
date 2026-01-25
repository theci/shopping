/**
 * 고객 상태 변경 Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerManagementApi } from '../api/customerManagementApi';
import { customerKeys } from './useAdminCustomers';
import { useToast } from '@/shared/hooks';
import type { CustomerStatusUpdateRequest } from '../types';

/**
 * 고객 상태 변경
 */
export const useUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({
      customerId,
      data,
    }: {
      customerId: number;
      data: CustomerStatusUpdateRequest;
    }) => customerManagementApi.updateCustomerStatus(customerId, data),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(customerId) });
      showToast({ type: 'success', message: '고객 상태가 변경되었습니다.' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '상태 변경에 실패했습니다.';
      showToast({ type: 'error', message });
    },
  });
};

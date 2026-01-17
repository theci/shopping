import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';
import { cartKeys } from './useCart';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useCartStore } from '../store/cartStore';

/**
 * 장바구니 아이템 선택 훅
 */
export const useCartSelection = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const {
    toggleSelection: toggleLocalSelection,
    toggleAllSelection: toggleAllLocalSelection,
    removeSelectedItems: removeLocalSelectedItems,
  } = useCartStore();

  const toggleMutation = useMutation({
    mutationFn: ({ itemId, selected }: { itemId: number; selected: boolean }) =>
      cartApi.toggleItemSelection(itemId, selected),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });

  const toggleAllMutation = useMutation({
    mutationFn: (selected: boolean) => cartApi.toggleAllSelection(selected),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });

  const removeSelectedMutation = useMutation({
    mutationFn: (itemIds: number[]) => cartApi.removeSelectedItems(itemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });

  const toggleSelection = (params: { itemId: number; productId: number; selected: boolean }) => {
    if (isAuthenticated) {
      toggleMutation.mutate({ itemId: params.itemId, selected: params.selected });
    } else {
      toggleLocalSelection(params.productId);
    }
  };

  const toggleAllSelection = (selected: boolean) => {
    if (isAuthenticated) {
      toggleAllMutation.mutate(selected);
    } else {
      toggleAllLocalSelection(selected);
    }
  };

  const removeSelectedItems = (itemIds: number[]) => {
    if (isAuthenticated) {
      removeSelectedMutation.mutate(itemIds);
    } else {
      removeLocalSelectedItems();
    }
  };

  return {
    toggleSelection,
    toggleAllSelection,
    removeSelectedItems,
    isPending: toggleMutation.isPending || toggleAllMutation.isPending || removeSelectedMutation.isPending,
  };
};

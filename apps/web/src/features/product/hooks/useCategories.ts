import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';

/**
 * Category Query Keys
 */
export const categoryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
};

/**
 * 카테고리 목록 조회 훅
 */
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => productApi.getCategories(),
    staleTime: 1000 * 60 * 30, // 30분 (카테고리는 자주 변경되지 않음)
  });
};

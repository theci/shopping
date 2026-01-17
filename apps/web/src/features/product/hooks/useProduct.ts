import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import { productKeys } from './useProducts';

/**
 * 상품 상세 조회 훅
 */
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProduct(id),
    enabled: !!id && id > 0,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

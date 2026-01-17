/**
 * API 공통 타입 (lib/api/types.ts에서 re-export)
 */
export type {
  ApiResponse,
  PageResponse,
  ApiError,
  PageRequest,
} from '@/lib/api/types';

/**
 * API 공통 상태
 */
export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 정렬 방향
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 정렬 정보
 */
export interface SortInfo {
  field: string;
  direction: SortDirection;
}

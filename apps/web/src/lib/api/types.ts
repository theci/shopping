/**
 * API 응답 공통 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * 페이징 응답 타입
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  pageNumber: number;  // alias for page (Spring Data compatibility)
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * API 에러 타입
 */
export interface ApiError {
  errorCode: string;
  message: string;
  timestamp: string;
  details?: Record<string, string>;
}

/**
 * 페이징 요청 파라미터
 */
export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

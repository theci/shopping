/**
 * API 공통 타입 - 백엔드와 일치
 */

/**
 * API 응답 래퍼
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
  timestamp: string;
}

/**
 * 페이지네이션 응답 (Spring Data Page 호환)
 */
export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * API 에러 응답
 */
export interface ErrorResponse {
  success: false;
  errorCode: string;
  message: string;
  fieldErrors?: Record<string, string>;
  timestamp: string;
}

/**
 * 페이지네이션 요청 파라미터
 */
export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

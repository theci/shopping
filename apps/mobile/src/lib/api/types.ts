/**
 * API 공통 타입 정의 - 백엔드와 일치
 */

// API 응답 공통 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
  timestamp: string;
}

// 페이지네이션 응답 타입 (Spring Data Page 호환)
export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  // 프론트엔드 호환 alias
  page?: number;
  size?: number;
}

// API 에러 타입
export interface ApiError {
  errorCode: string;
  message: string;
  timestamp: string;
  fieldErrors?: Record<string, string>;
}

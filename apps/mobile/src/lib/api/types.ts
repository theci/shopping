/**
 * API 공통 타입 정의
 */

// API 응답 공통 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// 페이지네이션 응답 타입
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// API 에러 타입
export interface ApiError {
  errorCode: string;
  message: string;
  timestamp: string;
  details?: Record<string, string>;
}

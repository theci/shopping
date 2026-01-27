/**
 * Customer Management API
 */

import { api } from '@/lib/api/client';
import type {
  Customer,
  CustomerListItem,
  CustomerOrder,
  CustomerSearchParams,
  CustomerStatusUpdateRequest,
  ApiResponse,
  PageResponse,
} from '../types';

export const customerManagementApi = {
  /**
   * 고객 목록 조회
   */
  getCustomers: async (params?: CustomerSearchParams): Promise<PageResponse<CustomerListItem>> => {
    const response = await api.get<ApiResponse<PageResponse<CustomerListItem>>>(
      '/api/v1/customers',
      params
    );
    return response.data;
  },

  /**
   * 고객 상세 조회
   */
  getCustomer: async (customerId: number): Promise<Customer> => {
    const response = await api.get<ApiResponse<Customer>>(
      `/api/v1/customers/${customerId}`
    );
    return response.data;
  },

  /**
   * 고객 주문 내역 조회
   */
  getCustomerOrders: async (
    customerId: number,
    params?: { page?: number; size?: number }
  ): Promise<PageResponse<CustomerOrder>> => {
    const response = await api.get<ApiResponse<PageResponse<CustomerOrder>>>(
      `/api/v1/customers/${customerId}/orders`,
      params
    );
    return response.data;
  },

  /**
   * 고객 상태 변경
   */
  updateCustomerStatus: async (
    customerId: number,
    data: CustomerStatusUpdateRequest
  ): Promise<Customer> => {
    const response = await api.patch<ApiResponse<Customer>>(
      `/api/v1/customers/${customerId}/status`,
      data
    );
    return response.data;
  },
};

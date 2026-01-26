import { api } from '@/lib/api/client';
import type {
  ApiResponse,
  Customer,
  UpdateProfileRequest,
  Address,
  AddressRequest,
  PasswordChangeRequest,
  WithdrawRequest,
} from '../types';

/**
 * Customer API
 */
export const customerApi = {
  /**
   * 내 정보 조회
   */
  getMe: async (): Promise<Customer> => {
    const response = await api.get<ApiResponse<Customer>>('/api/v1/customers/me');
    return response.data;
  },

  /**
   * 프로필 수정
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<Customer> => {
    const response = await api.put<ApiResponse<Customer>>('/api/v1/customers/me', data);
    return response.data;
  },

  /**
   * 비밀번호 변경
   */
  changePassword: async (data: PasswordChangeRequest): Promise<void> => {
    await api.put('/api/v1/customers/me/password', data);
  },

  /**
   * 배송지 목록 조회
   */
  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get<ApiResponse<Address[]>>('/api/v1/customers/me/addresses');
    return response.data;
  },

  /**
   * 배송지 상세 조회
   */
  getAddress: async (addressId: number): Promise<Address> => {
    const response = await api.get<ApiResponse<Address>>(`/v1/customers/me/addresses/${addressId}`);
    return response.data;
  },

  /**
   * 배송지 추가
   */
  addAddress: async (data: AddressRequest): Promise<Address> => {
    const response = await api.post<ApiResponse<Address>>('/api/v1/customers/me/addresses', data);
    return response.data;
  },

  /**
   * 배송지 수정
   */
  updateAddress: async (addressId: number, data: AddressRequest): Promise<Address> => {
    const response = await api.put<ApiResponse<Address>>(
      `/v1/customers/me/addresses/${addressId}`,
      data
    );
    return response.data;
  },

  /**
   * 배송지 삭제
   */
  deleteAddress: async (addressId: number): Promise<void> => {
    await api.delete(`/v1/customers/me/addresses/${addressId}`);
  },

  /**
   * 기본 배송지 설정
   */
  setDefaultAddress: async (addressId: number): Promise<void> => {
    await api.patch(`/v1/customers/me/addresses/${addressId}/default`);
  },

  /**
   * 회원탈퇴
   */
  withdraw: async (data: WithdrawRequest): Promise<void> => {
    await api.delete('/api/v1/customers/me', data);
  },
};

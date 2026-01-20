/**
 * Customer Feature - Public API
 */

// Components
export {
  ProfileForm,
  AddressList,
  AddressCard,
  AddressForm,
  addressSchema,
  type AddressFormData,
  PasswordChangeForm,
} from './components';

// Hooks
export {
  useCustomer,
  customerKeys,
  useUpdateProfile,
  useAddresses,
  useAddress,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useChangePassword,
  useWithdraw,
} from './hooks';

// API
export { customerApi } from './api';

// Types
export type {
  Customer,
  UpdateProfileRequest,
  Address,
  AddressRequest,
  PasswordChangeRequest,
  WithdrawRequest,
} from './types';

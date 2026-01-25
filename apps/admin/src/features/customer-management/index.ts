/**
 * Customer Management Feature - Public API
 */

// Components
export { CustomerTable, CustomerDetail } from './components';

// Hooks
export {
  useAdminCustomers,
  useAdminCustomer,
  useCustomerOrders,
  useUpdateCustomerStatus,
  customerKeys,
} from './hooks';

// API
export { customerManagementApi } from './api';

// Types
export type {
  CustomerStatus,
  CustomerListItem,
  Customer,
  CustomerAddress,
  CustomerOrder,
  CustomerSearchParams,
  CustomerStatusUpdateRequest,
} from './types';

export { CUSTOMER_STATUS_MAP } from './types';

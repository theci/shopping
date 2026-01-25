/**
 * Order Management Feature - Public API
 */

// Components
export { OrderTable, OrderDetail, OrderStatusBadge } from './components';

// Hooks
export {
  useAdminOrders,
  useAdminOrder,
  useUpdateOrderStatus,
  useUpdateShipping,
  useUpdateAdminMemo,
  orderKeys,
} from './hooks';

// API
export { orderManagementApi } from './api';

// Types
export type {
  OrderStatus,
  PaymentMethod,
  OrderItem,
  ShippingInfo,
  OrderCustomer,
  OrderListItem,
  Order,
  OrderSearchParams,
  OrderStatusUpdateRequest,
  ShippingUpdateRequest,
  AdminMemoRequest,
} from './types';

export { ORDER_STATUS_MAP, PAYMENT_METHOD_MAP, SHIPPING_COMPANIES } from './types';

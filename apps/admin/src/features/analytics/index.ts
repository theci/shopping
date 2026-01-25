// API
export { analyticsApi } from './api';

// Hooks
export {
  analyticsKeys,
  useDashboardStats,
  useDailySales,
  useMonthlySales,
  useOrderStatusStats,
  useTopProducts,
  useRecentOrders,
} from './hooks';

// Components
export {
  StatCard,
  SalesChart,
  OrdersChart,
  TopProducts,
  RecentOrders,
} from './components';

// Types
export type {
  DateRange,
  DashboardStats,
  DailySales,
  MonthlySales,
  OrderStatusStats,
  TopProduct,
  RecentOrder,
  AnalyticsParams,
} from './types';

export { DATE_RANGE_OPTIONS } from './types';

/**
 * Product Management Feature - Public API
 */

// Components
export { ProductTable, ProductForm, ProductStatusBadge } from './components';

// Hooks
export {
  useAdminProducts,
  useAdminProduct,
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useUpdateProductStatus,
  useUpdateStock,
  useDeleteProduct,
  productKeys,
} from './hooks';

// API
export { productManagementApi } from './api';

// Types
export type {
  ProductStatus,
  Category,
  ProductListItem,
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductSearchParams,
  StockUpdateRequest,
} from './types';

export { PRODUCT_STATUS_MAP } from './types';

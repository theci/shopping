/**
 * Product Feature - Public API
 */

// Components
export {
  ProductCard,
  ProductList,
  ProductListSkeleton,
  ProductDetail,
  ProductImages,
  ProductInfo,
  SearchBar,
  SearchFilters,
  CategoryNav,
} from './components';

// Hooks
export {
  useProducts,
  useProductSearch,
  useInfiniteProducts,
  productKeys,
  useProduct,
  useCategories,
  categoryKeys,
} from './hooks';

// API
export { productApi } from './api/productApi';

// Types
export type {
  ProductDetail as ProductDetailType,
  ProductListItem,
  ProductFilters,
  Product,
  ProductImage,
  ProductStatus,
  Category,
  ProductSearchParams,
  ApiResponse,
  PageResponse,
} from './types';

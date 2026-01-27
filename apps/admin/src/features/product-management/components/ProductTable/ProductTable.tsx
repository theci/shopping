'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Input, Skeleton } from '@/shared/components/ui';
import { formatPrice, formatDateTime } from '@/shared/utils/format';
import { ProductStatusBadge } from '../ProductStatusBadge';
import { useDeleteProduct, useUpdateProductStatus } from '../../hooks';
import { PRODUCT_STATUS_MAP } from '../../types';
import type { ProductListItem, ProductStatus, ProductSearchParams } from '../../types';

interface ProductTableProps {
  products: ProductListItem[];
  isLoading: boolean;
  filters: ProductSearchParams;
  onFilterChange: (filters: ProductSearchParams) => void;
  totalPages: number;
  currentPage: number;
}

export function ProductTable({
  products,
  isLoading,
  filters,
  onFilterChange,
  totalPages,
  currentPage,
}: ProductTableProps) {
  const [keyword, setKeyword] = useState(filters.keyword || '');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateProductStatus();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, keyword, page: 0 });
  };

  const handleStatusFilter = (status: ProductStatus | '') => {
    onFilterChange({
      ...filters,
      status: status || undefined,
      page: 0,
    });
  };

  const handleDelete = (id: number) => {
    deleteProduct(id, {
      onSuccess: () => setDeleteConfirmId(null),
    });
  };

  const handleStatusChange = (id: number, status: ProductStatus) => {
    updateStatus({ id, status });
  };

  const handlePageChange = (page: number) => {
    onFilterChange({ ...filters, page });
  };

  if (isLoading) {
    return <ProductTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <Input
            placeholder="상품명 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" variant="secondary">
            검색
          </Button>
        </form>

        <div className="flex gap-2">
          <select
            value={filters.status || ''}
            onChange={(e) => handleStatusFilter(e.target.value as ProductStatus | '')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">전체 상태</option>
            {Object.entries(PRODUCT_STATUS_MAP).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상품
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가격
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  재고
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  등록일
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    등록된 상품이 없습니다.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0].imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/products/${product.id}/edit`}
                            className="font-medium text-gray-900 hover:text-primary-600 truncate block"
                          >
                            {product.name}
                          </Link>
                          {product.category && (
                            <p className="text-sm text-gray-500">{product.category.name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        {product.discountPrice ? (
                          <>
                            <p className="font-medium text-gray-900">{formatPrice(product.discountPrice)}</p>
                            <p className="text-gray-400 line-through text-xs">
                              {formatPrice(product.price)}
                            </p>
                          </>
                        ) : (
                          <p className="font-medium text-gray-900">{formatPrice(product.price)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-medium ${
                          product.stockQuantity <= 10
                            ? 'text-red-600'
                            : product.stockQuantity <= 50
                            ? 'text-yellow-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {product.stockQuantity}개
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <ProductStatusBadge status={product.status} />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDateTime(product.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        {product.status === 'ACTIVE' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(product.id, 'INACTIVE')}
                            disabled={isUpdatingStatus}
                          >
                            판매중지
                          </Button>
                        ) : product.status === 'INACTIVE' || product.status === 'DRAFT' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(product.id, 'ACTIVE')}
                            disabled={isUpdatingStatus}
                          >
                            판매시작
                          </Button>
                        ) : null}
                        <Link href={`/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            수정
                          </Button>
                        </Link>
                        {deleteConfirmId === product.id ? (
                          <div className="flex gap-1">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              isLoading={isDeleting}
                            >
                              확인
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirmId(null)}
                            >
                              취소
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(product.id)}
                          >
                            삭제
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              페이지 {currentPage + 1} / {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                이전
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                다음
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

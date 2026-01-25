'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Spinner } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import { useTopProducts } from '../../hooks';

interface TopProductsProps {
  limit?: number;
}

export function TopProducts({ limit = 5 }: TopProductsProps) {
  const { data, isLoading } = useTopProducts(limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>베스트셀러</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : !data?.length ? (
          <div className="py-12 text-center text-gray-500">
            데이터가 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* 순위 */}
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-purple-600">{product.rank}</span>
                </div>

                {/* 상품 이미지 */}
                <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* 상품 정보 */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="font-medium text-gray-900 hover:text-purple-600 line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm text-gray-500">{product.salesCount}개 판매</p>
                </div>

                {/* 매출 */}
                <div className="text-right shrink-0">
                  <p className="font-medium text-gray-900">{formatPrice(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

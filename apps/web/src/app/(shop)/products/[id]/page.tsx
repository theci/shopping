'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Heart } from 'lucide-react';
import { ProductDetail, useProduct } from '@/features/product';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button } from '@/shared/components/ui';
import { useToast } from '@/shared/hooks';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const productId = Number(id);
  const router = useRouter();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuthStore();

  const { data: product, isLoading, error } = useProduct(productId);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast({ type: 'info', message: '로그인이 필요합니다.' });
      router.push(`/login?redirect=/products/${productId}`);
      return;
    }

    setIsAddingToCart(true);
    try {
      // TODO: 장바구니 API 연동 (Phase 1 Step 4)
      // await cartApi.addItem({ productId, quantity });
      showToast({ type: 'success', message: '장바구니에 추가되었습니다.' });
    } catch (err) {
      showToast({ type: 'error', message: '장바구니 추가에 실패했습니다.' });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      showToast({ type: 'info', message: '로그인이 필요합니다.' });
      router.push(`/login?redirect=/products/${productId}`);
      return;
    }

    // TODO: 바로구매 로직 (Phase 1 Step 6)
    router.push(`/checkout?productId=${productId}&quantity=${quantity}`);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h2>
          <p className="text-gray-500 mb-8">요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
          <Link href="/products">
            <Button>상품 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 브레드크럼 */}
      {product && (
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">홈</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-gray-700">상품</Link>
          {product.category && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link
                href={`/products?categoryId=${product.category.id}`}
                className="hover:text-gray-700"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </nav>
      )}

      {/* 상품 상세 */}
      {product ? (
        <ProductDetail
          product={product}
          isLoading={isLoading}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isAddingToCart={isAddingToCart}
        />
      ) : (
        <ProductDetail
          product={{} as any}
          isLoading={true}
        />
      )}

      {/* 수량 선택 (옵션) */}
      {product && !isLoading && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
          <div className="container mx-auto flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                disabled={product.stockQuantity !== undefined && quantity >= product.stockQuantity}
              >
                +
              </button>
            </div>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.status === 'OUT_OF_STOCK' || product.stockQuantity === 0 || isAddingToCart}
              isLoading={isAddingToCart}
            >
              장바구니
            </Button>
            <Button
              className="flex-1"
              onClick={handleBuyNow}
              disabled={product.status === 'OUT_OF_STOCK' || product.stockQuantity === 0}
            >
              바로구매
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

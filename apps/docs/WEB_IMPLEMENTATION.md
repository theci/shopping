# Web Application Implementation Guide

Next.js 14 기반 고객용 이커머스 웹 애플리케이션 구현 가이드

---

## 📱 애플리케이션 개요

**Target**: 데스크톱 & 모바일 웹 브라우저
**Framework**: Next.js 14 (App Router)
**Port**: 3000

### 주요 기능
- 🛍️ 상품 검색 및 탐색
- 🛒 장바구니 관리
- 💳 주문 및 결제
- 👤 회원 관리
- 📦 주문 내역 조회
- ⭐ 리뷰 작성
- ❤️ 찜하기

---

## 🏗️ 프로젝트 구조

```
apps/web/
├── src/
│   ├── app/                      # App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (shop)/
│   │   │   ├── page.tsx          # 홈
│   │   │   ├── products/
│   │   │   │   ├── page.tsx      # 상품 목록
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # 상품 상세
│   │   │   ├── cart/
│   │   │   │   └── page.tsx      # 장바구니
│   │   │   └── search/
│   │   │       └── page.tsx      # 검색 결과
│   │   ├── (checkout)/
│   │   │   └── checkout/
│   │   │       └── page.tsx      # 주문/결제
│   │   ├── (mypage)/
│   │   │   └── mypage/
│   │   │       ├── page.tsx      # 마이페이지 홈
│   │   │       ├── orders/       # 주문 내역
│   │   │       ├── reviews/      # 리뷰 관리
│   │   │       ├── wishlist/     # 찜 목록
│   │   │       └── profile/      # 프로필 설정
│   │   ├── layout.tsx            # Root Layout
│   │   └── globals.css
│   │
│   ├── features/                 # Feature 모듈
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── SocialLogin.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useLogin.ts
│   │   │   ├── api/
│   │   │   │   └── authApi.ts
│   │   │   └── store/
│   │   │       └── authStore.ts
│   │   │
│   │   ├── product/
│   │   │   ├── components/
│   │   │   │   ├── ProductList/
│   │   │   │   │   ├── ProductList.tsx
│   │   │   │   │   ├── ProductCard.tsx
│   │   │   │   │   ├── ProductFilter.tsx
│   │   │   │   │   └── ProductSort.tsx
│   │   │   │   ├── ProductDetail/
│   │   │   │   │   ├── ProductDetail.tsx
│   │   │   │   │   ├── ProductImages.tsx
│   │   │   │   │   ├── ProductInfo.tsx
│   │   │   │   │   ├── ProductOptions.tsx
│   │   │   │   │   └── ProductReviews.tsx
│   │   │   │   └── ProductSearch/
│   │   │   │       ├── SearchBar.tsx
│   │   │   │       └── SearchSuggestions.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProducts.ts
│   │   │   │   ├── useProductDetail.ts
│   │   │   │   ├── useProductSearch.ts
│   │   │   │   └── useInfiniteProducts.ts
│   │   │   └── api/
│   │   │       └── productApi.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── components/
│   │   │   │   ├── Cart.tsx
│   │   │   │   ├── CartItem.tsx
│   │   │   │   ├── CartSummary.tsx
│   │   │   │   └── EmptyCart.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCart.ts
│   │   │   │   └── useCartMutations.ts
│   │   │   ├── api/
│   │   │   │   └── cartApi.ts
│   │   │   └── store/
│   │   │       └── cartStore.ts
│   │   │
│   │   ├── order/
│   │   │   ├── components/
│   │   │   │   ├── Checkout/
│   │   │   │   │   ├── CheckoutForm.tsx
│   │   │   │   │   ├── ShippingAddress.tsx
│   │   │   │   │   ├── PaymentMethod.tsx
│   │   │   │   │   └── OrderSummary.tsx
│   │   │   │   ├── OrderHistory/
│   │   │   │   │   ├── OrderList.tsx
│   │   │   │   │   └── OrderCard.tsx
│   │   │   │   └── OrderDetail/
│   │   │   │       ├── OrderDetail.tsx
│   │   │   │       ├── OrderStatus.tsx
│   │   │   │       └── OrderItems.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCreateOrder.ts
│   │   │   │   ├── useOrders.ts
│   │   │   │   └── useOrderDetail.ts
│   │   │   └── api/
│   │   │       └── orderApi.ts
│   │   │
│   │   └── customer/
│   │       ├── components/
│   │       │   ├── Profile/
│   │       │   ├── AddressList/
│   │       │   └── PasswordChange/
│   │       ├── hooks/
│   │       │   └── useCustomer.ts
│   │       └── api/
│   │           └── customerApi.ts
│   │
│   ├── components/               # 공유 컴포넌트
│   │   ├── layouts/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── seo/
│   │       ├── SEO.tsx
│   │       └── JsonLd.tsx
│   │
│   ├── hooks/                    # 공유 Hooks
│   │   ├── useToast.ts
│   │   ├── useModal.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useResponsive.ts
│   │
│   ├── lib/                      # 라이브러리
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── queryClient.ts
│   │   ├── auth/
│   │   │   └── tokenManager.ts
│   │   ├── utils/
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   └── price.ts
│   │   └── constants/
│   │       ├── routes.ts
│   │       └── messages.ts
│   │
│   └── styles/
│       └── globals.css
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📄 주요 페이지 구현

### 1. 홈페이지 (/)

```typescript
// app/(shop)/page.tsx
import { Suspense } from 'react';
import { HeroSection } from '@/features/home/components/HeroSection';
import { CategorySection } from '@/features/home/components/CategorySection';
import { FeaturedProducts } from '@/features/product/components/FeaturedProducts';
import { BestSellers } from '@/features/product/components/BestSellers';

export const metadata = {
  title: 'E-Commerce Store - 최고의 상품을 만나보세요',
  description: '다양한 카테고리의 프리미엄 상품을 합리적인 가격에',
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      <CategorySection />

      <Suspense fallback={<ProductListSkeleton />}>
        <FeaturedProducts />
      </Suspense>

      <Suspense fallback={<ProductListSkeleton />}>
        <BestSellers />
      </Suspense>
    </div>
  );
}
```

### 2. 상품 목록 (/products)

```typescript
// app/(shop)/products/page.tsx
import { ProductList } from '@/features/product/components/ProductList';
import { ProductFilter } from '@/features/product/components/ProductFilter';
import { ProductSort } from '@/features/product/components/ProductSort';

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; minPrice?: string; maxPrice?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* 좌측 필터 */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilter />
        </aside>

        {/* 상품 목록 */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">전체 상품</h1>
            <ProductSort />
          </div>

          <ProductList searchParams={searchParams} />
        </main>
      </div>
    </div>
  );
}
```

**ProductList 컴포넌트**

```typescript
// features/product/components/ProductList/ProductList.tsx
'use client';

import { useInfiniteProducts } from '@/features/product/hooks/useInfiniteProducts';
import { ProductCard } from './ProductCard';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export function ProductList({ searchParams }: { searchParams: any }) {
  const { data, fetchNextPage, hasNextPage, isLoading, isError } = useInfiniteProducts({
    categoryId: searchParams.category,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <ProductListSkeleton />;
  if (isError) return <ErrorMessage />;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {data?.pages.map((page) =>
          page.content.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* 무한 스크롤 트리거 */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-8">
          <Loading />
        </div>
      )}
    </div>
  );
}
```

**ProductCard 컴포넌트**

```typescript
// features/product/components/ProductList/ProductCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/price';
import { Button } from '@repo/ui';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '@repo/shared-types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountRate = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`}>
        {/* 이미지 */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0]?.imageUrl || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* 할인 배지 */}
          {discountRate > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
              {discountRate}%
            </div>
          )}

          {/* 품절 오버레이 */}
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">품절</span>
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>

          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-red-500">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* 평점 */}
          {product.averageRating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium">{product.averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({product.reviewCount})</span>
            </div>
          )}
        </div>
      </Link>

      {/* 액션 버튼 */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
          onClick={(e) => {
            e.preventDefault();
            // 찜하기
          }}
        >
          <Heart className="w-5 h-5" />
        </button>
        <button
          className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
          onClick={(e) => {
            e.preventDefault();
            // 장바구니 담기
          }}
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

### 3. 상품 상세 (/products/[id])

```typescript
// app/(shop)/products/[id]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { productApi } from '@/features/product/api/productApi';
import { ProductDetail } from '@/features/product/components/ProductDetail';
import { ProductReviews } from '@/features/product/components/ProductReviews';
import { RelatedProducts } from '@/features/product/components/RelatedProducts';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await productApi.getProduct(Number(params.id));

  return {
    title: `${product.name} - E-Commerce Store`,
    description: product.description,
    openGraph: {
      images: [product.images[0]?.imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await productApi.getProduct(Number(params.id));

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />

      <div className="mt-12">
        <Suspense fallback={<ReviewsSkeleton />}>
          <ProductReviews productId={product.id} />
        </Suspense>
      </div>

      <div className="mt-12">
        <Suspense fallback={<ProductListSkeleton />}>
          <RelatedProducts categoryId={product.category.id} productId={product.id} />
        </Suspense>
      </div>
    </div>
  );
}
```

**ProductDetail 컴포넌트**

```typescript
// features/product/components/ProductDetail/ProductDetail.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@repo/ui';
import { formatPrice } from '@/lib/utils/price';
import { useCartMutations } from '@/features/cart/hooks/useCartMutations';
import { useToast } from '@/hooks/useToast';
import type { Product } from '@repo/shared-types';

export function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const { addToCart } = useCartMutations();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity,
        options: Object.entries(selectedOptions).map(([name, value]) => ({
          name,
          value,
        })),
      });

      toast({
        title: '장바구니에 추가되었습니다',
        type: 'success',
      });
    } catch (error) {
      toast({
        title: '장바구니 추가 실패',
        description: error.message,
        type: 'error',
      });
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    // 장바구니 페이지로 이동
    router.push('/cart');
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* 좌측: 이미지 */}
      <div className="space-y-4">
        {/* 메인 이미지 */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={product.images[selectedImage]?.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* 썸네일 */}
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded overflow-hidden border-2 ${
                selectedImage === index ? 'border-primary-500' : 'border-gray-200'
              }`}
            >
              <Image src={image.imageUrl} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* 우측: 정보 */}
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* 평점 */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="font-medium">{product.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-gray-500">({product.reviewCount}개 리뷰)</span>
          </div>
        </div>

        {/* 가격 */}
        <div className="border-y py-4">
          {product.discountPrice ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-red-500">
                  {Math.round(
                    ((product.price - product.discountPrice) / product.price) * 100
                  )}
                  %
                </span>
                <span className="text-3xl font-bold">{formatPrice(product.discountPrice)}</span>
              </div>
              <p className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</p>
            </div>
          ) : (
            <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
          )}
        </div>

        {/* 옵션 선택 */}
        {product.options && product.options.length > 0 && (
          <div className="space-y-4">
            {product.options.map((option) => (
              <div key={option.id}>
                <label className="block text-sm font-medium mb-2">{option.name}</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={selectedOptions[option.name] || ''}
                  onChange={(e) =>
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [option.name]: e.target.value,
                    }))
                  }
                >
                  <option value="">선택하세요</option>
                  {option.values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* 수량 선택 */}
        <div>
          <label className="block text-sm font-medium mb-2">수량</label>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </Button>
            <span className="w-12 text-center">{quantity}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
            >
              +
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            재고: {product.stockQuantity}개
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={handleBuyNow}
            disabled={product.stockQuantity === 0}
          >
            {product.stockQuantity === 0 ? '품절' : '바로 구매'}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0 || addToCart.isLoading}
          >
            {addToCart.isLoading ? '추가 중...' : '장바구니'}
          </Button>
        </div>

        {/* 배송 정보 */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">배송비</span>
            <span className="font-medium">
              {product.shipping.fee === 0 ? '무료배송' : formatPrice(product.shipping.fee)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">배송 예정</span>
            <span className="font-medium">{product.shipping.estimatedDays}일 소요</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

이 문서를 계속 작성하시겠습니까? 장바구니, 결제, 마이페이지 등 나머지 페이지와 모바일, Admin 앱 가이드까지 모두 작성하겠습니다.

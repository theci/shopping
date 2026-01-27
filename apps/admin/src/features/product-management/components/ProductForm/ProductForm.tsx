'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui';
import { useCategories, useCreateProduct, useUpdateProduct } from '../../hooks';
import { PRODUCT_STATUS_MAP } from '../../types';
import type { Product, ProductCreateRequest, ProductUpdateRequest, ProductStatus } from '../../types';

interface ProductFormProps {
  product?: Product;
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
  status: ProductStatus;
  categoryId?: number;
  brand: string;
  imageUrl: string;
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const { data: categories } = useCategories();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    stockQuantity: 0,
    status: 'DRAFT' as ProductStatus,
    categoryId: undefined,
    brand: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        discountPrice: product.discountPrice || 0,
        stockQuantity: product.stockQuantity,
        status: product.status,
        categoryId: product.category?.id,
        brand: product.brand || '',
        imageUrl: product.images?.[0]?.imageUrl || '',
      });
    }
  }, [product, mode]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name?.trim()) {
      newErrors.name = '상품명을 입력해주세요.';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = '판매가를 입력해주세요.';
    }

    if (formData.stockQuantity === undefined || formData.stockQuantity < 0) {
      newErrors.stockQuantity = '재고 수량을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData: ProductCreateRequest = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      discountPrice: formData.discountPrice || undefined,
      stockQuantity: formData.stockQuantity,
      status: formData.status,
      categoryId: formData.categoryId,
      brand: formData.brand,
      images: formData.imageUrl ? [{ imageUrl: formData.imageUrl, displayOrder: 1 }] : undefined,
    };

    if (mode === 'create') {
      createProduct(submitData);
    } else if (product) {
      updateProduct({ id: product.id, data: submitData as ProductUpdateRequest });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : 0) : value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 기본 정보 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="상품명"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                error={errors.name}
                placeholder="상품명을 입력하세요"
                disabled={isPending}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상품 설명
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={5}
                  placeholder="상품 설명을 입력하세요"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              <Input
                label="브랜드"
                name="brand"
                value={formData.brand || ''}
                onChange={handleChange}
                placeholder="브랜드명을 입력하세요"
                disabled={isPending}
              />

              <Input
                label="대표 이미지 URL"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                disabled={isPending}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>가격 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="정가"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  error={errors.price}
                  placeholder="0"
                  disabled={isPending}
                />
                <Input
                  type="number"
                  label="할인가 (선택)"
                  name="discountPrice"
                  value={formData.discountPrice || ''}
                  onChange={handleChange}
                  placeholder="0"
                  helperText="할인 적용 시 판매될 가격"
                  disabled={isPending}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>재고 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                label="재고 수량"
                name="stockQuantity"
                value={formData.stockQuantity ?? ''}
                onChange={handleChange}
                error={errors.stockQuantity}
                placeholder="0"
                disabled={isPending}
              />
            </CardContent>
          </Card>
        </div>

        {/* 사이드 패널 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>상품 상태</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                name="status"
                value={formData.status || 'DRAFT'}
                onChange={handleChange}
                disabled={isPending}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {Object.entries(PRODUCT_STATUS_MAP).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>카테고리</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={handleChange}
                disabled={isPending}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">카테고리 선택</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button type="submit" fullWidth isLoading={isPending}>
                {mode === 'create' ? '상품 등록' : '상품 수정'}
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => router.push('/products')}
                disabled={isPending}
              >
                취소
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

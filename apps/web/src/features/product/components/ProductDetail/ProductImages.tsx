'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/utils/cn';

interface ProductImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

interface ProductImagesProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const sortedImages = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
  const selectedImage = sortedImages[selectedIndex];

  if (!sortedImages.length) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 메인 이미지 */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={selectedImage.imageUrl}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* 썸네일 목록 */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative w-20 h-20 rounded-md overflow-hidden shrink-0 border-2 transition-colors',
                selectedIndex === index
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-gray-300'
              )}
            >
              <Image
                src={image.imageUrl}
                alt={`${productName} - ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

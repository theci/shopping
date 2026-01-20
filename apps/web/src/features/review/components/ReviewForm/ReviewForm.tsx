'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ImagePlus } from 'lucide-react';
import { Button, Input, Modal } from '@/shared/components/ui';
import { ReviewRating } from '../ReviewRating';
import { useCreateReview, useUpdateReview } from '../../hooks';
import { RATING_LABELS } from '../../types';
import type { Review, ReviewCreateRequest, ReviewUpdateRequest } from '../../types';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  orderId: number;
  review?: Review;
  mode: 'create' | 'edit';
}

/**
 * 리뷰 작성/수정 폼 컴포넌트
 */
export function ReviewForm({
  isOpen,
  onClose,
  productId,
  orderId,
  review,
  mode,
}: ReviewFormProps) {
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [content, setContent] = useState(review?.content ?? '');
  const [imageUrls, setImageUrls] = useState<string[]>(review?.imageUrls ?? []);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const { mutate: createReview, isPending: isCreating } = useCreateReview();
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      setRating(review?.rating ?? 0);
      setContent(review?.content ?? '');
      setImageUrls(review?.imageUrls ?? []);
    }
  }, [isOpen, review]);

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    if (imageUrls.length >= 5) return;

    setImageUrls((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) return;

    if (mode === 'create') {
      const data: ReviewCreateRequest = {
        orderId,
        productId,
        rating,
        content: content.trim() || undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      };
      createReview(data, {
        onSuccess: () => {
          onClose();
          resetForm();
        },
      });
    } else if (review) {
      const data: ReviewUpdateRequest = {
        rating,
        content: content.trim() || undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      };
      updateReview(
        { reviewId: review.id, data },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  const resetForm = () => {
    setRating(0);
    setContent('');
    setImageUrls([]);
    setImageUrlInput('');
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      if (mode === 'create') {
        resetForm();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? '리뷰 작성' : '리뷰 수정'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 별점 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            별점
          </label>
          <div className="flex items-center gap-3">
            <ReviewRating
              rating={rating}
              size="lg"
              interactive
              onChange={setRating}
            />
            {rating > 0 && (
              <span className="text-sm text-gray-600">{RATING_LABELS[rating]}</span>
            )}
          </div>
          {rating === 0 && (
            <p className="mt-1 text-sm text-red-500">별점을 선택해주세요</p>
          )}
        </div>

        {/* 내용 */}
        <div>
          <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-2">
            리뷰 내용 (선택)
          </label>
          <textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="상품에 대한 솔직한 리뷰를 작성해주세요"
            rows={4}
            maxLength={2000}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-xs text-gray-500 text-right">
            {content.length}/2000
          </p>
        </div>

        {/* 이미지 추가 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지 (선택, 최대 5장)
          </label>

          {/* 이미지 미리보기 */}
          {imageUrls.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                >
                  <Image
                    src={url}
                    alt={`리뷰 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-0.5 bg-black/50 rounded-full"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 이미지 URL 입력 */}
          {imageUrls.length < 5 && (
            <div className="flex gap-2">
              <Input
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="이미지 URL을 입력하세요"
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddImage}
                disabled={!imageUrlInput.trim()}
              >
                <ImagePlus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={rating === 0}>
            {mode === 'create' ? '작성하기' : '수정하기'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

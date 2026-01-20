'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MoreVertical, Flag, Pencil, Trash2 } from 'lucide-react';
import { Button, Modal } from '@/shared/components/ui';
import { formatRelativeTime } from '@/shared/utils/format';
import { ReviewRating } from '../ReviewRating';
import { useDeleteReview, useReportReview } from '../../hooks';
import type { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
  isOwner?: boolean;
  onEdit?: (review: Review) => void;
}

/**
 * 리뷰 카드 컴포넌트
 */
export function ReviewCard({ review, isOwner = false, onEdit }: ReviewCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();
  const { mutate: reportReview, isPending: isReporting } = useReportReview();

  const handleDelete = () => {
    deleteReview(
      { reviewId: review.id, productId: review.productId },
      { onSuccess: () => setShowDeleteModal(false) }
    );
  };

  const handleReport = () => {
    if (!reportReason.trim()) return;
    reportReview(
      { reviewId: review.id, data: { reason: reportReason } },
      {
        onSuccess: () => {
          setShowReportModal(false);
          setReportReason('');
        },
      }
    );
  };

  return (
    <div className="py-6 border-b border-gray-200 last:border-b-0">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <ReviewRating rating={review.rating} size="sm" />
          <span className="text-sm text-gray-500">
            {formatRelativeTime(review.createdAt)}
          </span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 z-20 mt-1 w-32 bg-white rounded-lg shadow-lg border">
                {isOwner ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onEdit?.(review);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil className="w-4 h-4" />
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteModal(true);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowReportModal(true);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Flag className="w-4 h-4" />
                    신고
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 내용 */}
      {review.content && (
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{review.content}</p>
      )}

      {/* 이미지 */}
      {review.imageUrls && review.imageUrls.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {review.imageUrls.map((url, index) => (
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
            </div>
          ))}
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="리뷰 삭제"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            정말로 이 리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>

      {/* 신고 모달 */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="리뷰 신고"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="report-reason" className="block text-sm font-medium text-gray-700 mb-1">
              신고 사유
            </label>
            <textarea
              id="report-reason"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="신고 사유를 입력해주세요"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowReportModal(false)}
              disabled={isReporting}
            >
              취소
            </Button>
            <Button
              onClick={handleReport}
              isLoading={isReporting}
              disabled={!reportReason.trim()}
            >
              신고하기
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

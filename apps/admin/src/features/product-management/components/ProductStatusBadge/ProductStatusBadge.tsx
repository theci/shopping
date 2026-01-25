'use client';

import { Badge } from '@/shared/components/ui';
import { PRODUCT_STATUS_MAP } from '../../types';
import type { ProductStatus } from '../../types';

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const statusInfo = PRODUCT_STATUS_MAP[status];

  return (
    <Badge variant={statusInfo?.variant || 'default'}>
      {statusInfo?.label || status}
    </Badge>
  );
}

'use client';

import { Badge } from '@/shared/components/ui';
import { ORDER_STATUS_MAP } from '../../types';
import type { OrderStatus } from '../../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusInfo = ORDER_STATUS_MAP[status];

  return (
    <Badge variant={statusInfo.variant}>
      {statusInfo.label}
    </Badge>
  );
}

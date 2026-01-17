'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui';
import { useCart } from '../../hooks/useCart';

interface CartButtonProps {
  className?: string;
}

export function CartButton({ className }: CartButtonProps) {
  const { totalQuantity } = useCart();

  return (
    <Link href="/cart">
      <Button variant="ghost" size="sm" className={className}>
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
              {totalQuantity > 99 ? '99+' : totalQuantity}
            </span>
          )}
        </div>
      </Button>
    </Link>
  );
}

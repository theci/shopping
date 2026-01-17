'use client';

import { useState } from 'react';
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { useAddToCart } from '../../hooks/useAddToCart';

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  productImage?: string;
  price: number;
  stockQuantity: number;
  disabled?: boolean;
  showQuantitySelector?: boolean;
  className?: string;
}

export function AddToCartButton({
  productId,
  productName,
  productImage,
  price,
  stockQuantity,
  disabled,
  showQuantitySelector = false,
  className,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart, isPending } = useAddToCart();

  const isOutOfStock = stockQuantity === 0;

  const handleAddToCart = () => {
    addToCart({
      productId,
      productName,
      productImage,
      price,
      quantity,
      stockQuantity,
    });

    // 성공 표시
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setQuantity(1);
    }, 2000);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  if (showSuccess) {
    return (
      <Button
        variant="outline"
        fullWidth
        size="lg"
        className={className}
        disabled
      >
        <Check className="w-5 h-5 mr-2 text-green-500" />
        장바구니에 담김
      </Button>
    );
  }

  return (
    <div className={className}>
      {showQuantitySelector && !isOutOfStock && (
        <div className="flex items-center justify-center gap-3 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-10 h-10 p-0"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center text-lg font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= stockQuantity}
            className="w-10 h-10 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      <Button
        variant="outline"
        fullWidth
        size="lg"
        onClick={handleAddToCart}
        disabled={disabled || isOutOfStock || isPending}
        isLoading={isPending}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {isOutOfStock ? '품절' : '장바구니 담기'}
      </Button>
    </div>
  );
}

'use client';

import { CreditCard, Building2, Wallet } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import type { PaymentMethod as PaymentMethodType } from '../../types';

interface PaymentMethodProps {
  value: PaymentMethodType | null;
  onChange: (method: PaymentMethodType) => void;
}

const paymentMethods: { value: PaymentMethodType; label: string; icon: React.ElementType }[] = [
  { value: 'CARD', label: '신용/체크카드', icon: CreditCard },
  { value: 'BANK_TRANSFER', label: '계좌이체', icon: Building2 },
  { value: 'VIRTUAL_ACCOUNT', label: '가상계좌', icon: Building2 },
  { value: 'TOSS_PAY', label: '토스페이', icon: Wallet },
];

export function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-4">결제 수단</h3>

      <div className="grid grid-cols-2 gap-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = value === method.value;

          return (
            <label
              key={method.value}
              className={cn(
                'flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={isSelected}
                onChange={() => onChange(method.value)}
                className="sr-only"
              />
              <Icon
                className={cn(
                  'w-5 h-5',
                  isSelected ? 'text-blue-600' : 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  isSelected ? 'text-blue-700' : 'text-gray-700'
                )}
              >
                {method.label}
              </span>
            </label>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        * 결제는 토스 페이먼츠를 통해 안전하게 처리됩니다.
      </p>
    </Card>
  );
}

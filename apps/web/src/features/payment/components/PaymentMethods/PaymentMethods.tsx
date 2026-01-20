'use client';

import { CreditCard, Building2, Smartphone, Wallet } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import type { PaymentMethodType } from '../../types';

interface PaymentMethodOption {
  value: PaymentMethodType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    value: 'CARD',
    label: '신용/체크카드',
    description: '모든 카드 결제 가능',
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    value: 'VIRTUAL_ACCOUNT',
    label: '가상계좌',
    description: '무통장 입금',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    value: 'EASY_PAY',
    label: '간편결제',
    description: '토스페이, 카카오페이 등',
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    value: 'MOBILE',
    label: '휴대폰 결제',
    description: '통신사 결제',
    icon: <Smartphone className="w-5 h-5" />,
  },
];

interface PaymentMethodsProps {
  value: PaymentMethodType | null;
  onChange: (method: PaymentMethodType) => void;
  disabled?: boolean;
}

export function PaymentMethods({ value, onChange, disabled }: PaymentMethodsProps) {
  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 mb-4">결제 수단 선택</h3>

      <div className="grid grid-cols-2 gap-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.value}
            type="button"
            className={cn(
              'flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-colors',
              value === method.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => onChange(method.value)}
            disabled={disabled}
          >
            <span
              className={cn(
                'p-2 rounded-full',
                value === method.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              )}
            >
              {method.icon}
            </span>
            <div>
              <p className="font-medium text-gray-900">{method.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 안내 문구 */}
      <p className="text-xs text-gray-500 mt-4">
        * Toss Payments 결제 위젯을 사용하시면 더 많은 결제 수단을 이용하실 수 있습니다.
      </p>
    </Card>
  );
}

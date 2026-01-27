'use client';

import { useAuthStore } from '@/features/auth';
import { Badge } from '@/shared/components/ui';
import { ADMIN_ROLE_MAP } from '@/features/auth/types';

interface HeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

export function Header({ title, actions }: HeaderProps) {
  const admin = useAuthStore((state) => state.admin);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        <div className="flex items-center gap-4">
          {admin && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{admin.name}</span>
              <Badge variant={admin.role === 'ADMIN' ? 'danger' : 'primary'}>
                {ADMIN_ROLE_MAP[admin.role]?.label || admin.role}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
}

export default function Card({ children, className, variant = 'default' }: CardProps) {
  const baseClasses = 'rounded-xl p-4';

  const variantClasses = {
    default: 'bg-surface-dark border border-white/5',
    glass: 'glass-card',
  };

  return (
    <div className={clsx(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );
}

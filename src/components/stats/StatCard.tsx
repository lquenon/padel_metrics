import type { ReactNode } from 'react';
import Card from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
}

export default function StatCard({ title, value, subtitle, icon, variant = 'default' }: StatCardProps) {
  const variantClasses = {
    default: 'text-white',
    primary: 'text-primary',
    secondary: 'text-secondary-neon',
  };

  return (
    <Card className="text-center">
      {icon && (
        <div className="flex justify-center mb-2 text-white/40">
          {icon}
        </div>
      )}
      <div className={`text-3xl font-bold mb-1 ${variantClasses[variant]}`}>
        {value}
      </div>
      <div className="text-sm font-medium text-white/80 mb-1">
        {title}
      </div>
      {subtitle && (
        <div className="text-xs text-white/50">
          {subtitle}
        </div>
      )}
    </Card>
  );
}

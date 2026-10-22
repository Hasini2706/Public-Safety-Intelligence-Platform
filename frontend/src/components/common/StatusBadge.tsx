import React from 'react';
import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  status: 'active' | 'ready' | 'foundation_ready' | 'not_configured' | 'offline' | 'error' | 'warning' | string;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const normalized = status.toLowerCase();

  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';
  let defaultLabel = label || status;

  if (normalized === 'active' || normalized === 'healthy' || normalized === 'ready') {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
    defaultLabel = label || (normalized === 'ready' ? 'Model Ready' : 'Active');
  } else if (normalized === 'foundation_ready' || normalized === 'in_progress') {
    style = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
    defaultLabel = label || 'Foundation Ready';
  } else if (normalized === 'not_configured') {
    style = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
    defaultLabel = label || 'Not Configured';
  } else if (normalized === 'offline' || normalized === 'error' || normalized === 'critical') {
    style = 'bg-rose-50 text-rose-700 border-rose-200';
    dotColor = 'bg-rose-500';
    defaultLabel = label || 'Offline';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        style,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />
      {defaultLabel}
    </span>
  );
};

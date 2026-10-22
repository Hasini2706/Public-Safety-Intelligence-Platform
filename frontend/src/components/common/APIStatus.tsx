import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Server } from 'lucide-react';

interface APIStatusProps {
  status: 'active' | 'offline' | 'degraded' | string;
  endpoint?: string;
  className?: string;
}

export const APIStatus: React.FC<APIStatusProps> = ({ status, endpoint, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 text-xs text-slate-600 ${className}`}>
      <Server className="w-4 h-4 text-slate-400" />
      <span>API:</span>
      <StatusBadge status={status} />
      {endpoint && <span className="text-slate-400 font-mono text-[11px]">{endpoint}</span>}
    </div>
  );
};

import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Cpu } from 'lucide-react';

interface ModelStatusProps {
  status: 'not_configured' | 'foundation_ready' | 'ready' | 'error' | string;
  version?: string;
  className?: string;
}

export const ModelStatus: React.FC<ModelStatusProps> = ({ status, version, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 text-xs text-slate-600 ${className}`}>
      <Cpu className="w-4 h-4 text-slate-400" />
      <span>ML Model:</span>
      <StatusBadge status={status} />
      {version && <span className="text-slate-400 font-mono">({version})</span>}
    </div>
  );
};

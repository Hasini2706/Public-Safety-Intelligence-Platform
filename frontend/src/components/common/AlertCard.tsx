import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface AlertCardProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  message: string;
  timestamp?: string;
  isDemo?: boolean;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  type = 'info',
  title,
  message,
  timestamp,
  isDemo = false,
}) => {
  const styles = {
    info: 'bg-blue-50/60 border-blue-200 text-blue-800 icon-blue-600',
    warning: 'bg-amber-50/60 border-amber-200 text-amber-800 icon-amber-600',
    error: 'bg-rose-50/60 border-rose-200 text-rose-800 icon-rose-600',
    success: 'bg-emerald-50/60 border-emerald-200 text-emerald-800 icon-emerald-600',
  }[type];

  const icons = {
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
  }[type];

  return (
    <div className={`p-4 rounded-lg border flex items-start gap-3 ${styles}`}>
      {icons}
      <div className="flex-1 text-xs">
        <div className="flex items-center justify-between mb-0.5">
          {title && <span className="font-semibold text-slate-900">{title}</span>}
          <div className="flex items-center gap-2">
            {isDemo && (
              <span className="text-[9px] uppercase tracking-wider font-semibold px-1 py-0.5 rounded bg-slate-200/70 text-slate-600">
                Sample
              </span>
            )}
            {timestamp && <span className="text-[11px] text-slate-500">{timestamp}</span>}
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

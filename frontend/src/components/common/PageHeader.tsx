import React from 'react';
import { ModelStatus } from './ModelStatus';
import { APIStatus } from './APIStatus';

interface PageHeaderProps {
  title: string;
  description: string;
  badge?: React.ReactNode;
  branch?: string;
  apiStatus?: string;
  mlStatus?: string;
  modelVersion?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  branch,
  apiStatus,
  mlStatus,
  modelVersion,
  actions,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-5 sm:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            {badge}
          </div>
          <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
            {description}
          </p>

          {(branch || apiStatus || mlStatus) && (
            <div className="mt-3 flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-xs">
              {branch && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="font-semibold text-slate-500">Branch:</span>
                  <code className="bg-slate-100 text-blue-700 px-2 py-0.5 rounded font-mono text-[11px] font-medium">
                    {branch}
                  </code>
                </div>
              )}
              {apiStatus && <APIStatus status={apiStatus} />}
              {mlStatus && <ModelStatus status={mlStatus} version={modelVersion} />}
            </div>
          )}
        </div>

        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
};

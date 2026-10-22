import React from 'react';
import { Link } from 'react-router-dom';
import { ModuleMetadata } from '../../types';
import { Icon } from './Icon';
import { StatusBadge } from './StatusBadge';
import { ArrowRight, GitBranch } from 'lucide-react';

interface ModuleCardProps {
  module: ModuleMetadata;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
            <Icon name={module.iconName} className="w-5 h-5" />
          </div>
          <StatusBadge status={module.mlStatus} />
        </div>

        <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
          {module.name}
        </h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {module.description}
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-slate-400" />
              <span>Branch:</span>
            </span>
            <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
              {module.branch}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Assigned:</span>
            <span className="font-medium text-slate-700">{module.developer}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3">
        <Link
          to={module.path}
          className="inline-flex items-center justify-between w-full px-3.5 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          <span>Open Module Console</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

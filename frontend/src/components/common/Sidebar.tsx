import React from 'react';
import { NavLink } from 'react-router-dom';
import { SIDEBAR_NAV } from '../../config/navigation';
import { Icon } from './Icon';
import { Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-300 transition-all duration-200 border-r border-slate-800',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand / Logo header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/40">
          <NavLink to="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:bg-blue-500 transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-white tracking-wide truncate">
                  PUBLIC SAFETY AI
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold truncate">
                  Intelligence Platform
                </span>
              </div>
            )}
          </NavLink>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {SIDEBAR_NAV.map((section, idx) => (
            <div key={idx}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group',
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white',
                        collapsed && 'justify-center px-2'
                      )
                    }
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon
                      name={item.icon}
                      className={cn('w-4 h-4 shrink-0 transition-colors')}
                    />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        {!collapsed ? (
          <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/30">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span>Platform Core</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 text-[10px] font-mono border border-blue-700/50">
                v1.0-base
              </span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400">5 Modules Foundation</p>
          </div>
        ) : (
          <div className="p-3 border-t border-slate-800 text-center">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="System Online" />
          </div>
        )}
      </aside>
    </>
  );
};

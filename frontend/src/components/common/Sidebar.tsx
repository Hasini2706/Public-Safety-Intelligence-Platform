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
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0F1C36] text-slate-300 transition-all duration-200 border-r border-slate-800/80',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand / Logo header */}
        <div className="h-18 flex items-center justify-between px-5 pt-5 pb-4">
          <NavLink to="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-900/40">
              <Shield className="w-5 h-5 fill-white/20 stroke-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[15px] text-white tracking-tight truncate">
                  Public Safety AI
                </span>
                <span className="text-[11px] text-slate-400 font-normal truncate">
                  Intelligence Platform
                </span>
              </div>
            )}
          </NavLink>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1.5">
          {SIDEBAR_NAV[0]?.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs transition-all group font-medium',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-900/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
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

        {/* Bottom Pinned Settings */}
        <div className="p-3 border-t border-slate-800/80">
          <NavLink
            to="/system-status"
            onClick={onCloseMobile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs transition-all text-slate-400 hover:text-white hover:bg-white/5 font-medium',
                isActive && 'text-white bg-white/10 font-semibold',
                collapsed && 'justify-center px-2'
              )
            }
            title={collapsed ? 'Settings' : undefined}
          >
            <Icon name="Settings" className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-white" />
            {!collapsed && <span className="truncate">Settings</span>}
          </NavLink>
        </div>
      </aside>
    </>
  );
};


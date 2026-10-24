import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../utils/cn';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex flex-col">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-200',
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <Header onOpenMobile={() => setMobileOpen(true)} />

        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {!isDashboard && (
          <footer className="bg-white border-t border-slate-200 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 Public Safety Intelligence Platform — University Research Project</p>
            <p className="text-[11px] text-slate-400">
              5 Collaborating ML Engineers • Independent Feature Branches
            </p>
          </footer>
        )}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../utils/cn';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      </div>
    </div>
  );
};



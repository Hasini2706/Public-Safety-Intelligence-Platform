import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '../components/common/AppShell';

export const RootLayout: React.FC = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

import React from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', width: '100%' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', overflowX: 'hidden', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
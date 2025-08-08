// resources/js/Layouts/AuthenticatedLayout.tsx

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
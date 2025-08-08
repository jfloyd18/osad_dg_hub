import React, { PropsWithChildren } from 'react';
import Sidebar from '@/components/Sidebar'; // Assuming path is 'resources/js/components/Sidebar.tsx'
import Header from '@/components/Header';   // Assuming path is 'resources/js/components/Header.tsx'

// The 'children' prop will be the actual page content passed from Inertia
const AuthenticatedLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        {/* The main content of your page will be rendered here */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;

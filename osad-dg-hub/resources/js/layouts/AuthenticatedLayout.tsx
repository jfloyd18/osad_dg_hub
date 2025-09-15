import React, { PropsWithChildren } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const AuthenticatedLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <Header />
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
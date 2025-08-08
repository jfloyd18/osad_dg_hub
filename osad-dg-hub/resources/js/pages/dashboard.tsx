// resources/js/pages/dashboard.tsx

import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const Dashboard: React.FC = () => {
  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome to your Dashboard!</h1>
        <p className="mt-4">This is where your dashboard content will go.</p>
      </div>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
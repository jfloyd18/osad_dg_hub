// In: resources/js/pages/Admin/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import apiClient from '@/lib/api'; // Your axios instance

// --- Helper Types ---
interface Stat {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}
interface RecentRequest {
    id: number;
    incident_title: string;
    created_at: string;
    status: 'Pending' | 'Approved' | 'Revisions' | 'Rejected';
    feedback: string | null;
}
interface BookedFacility {
    facility_name: string;
    total: number;
}

// --- Reusable Components ---
const StatCard = ({ title, value, colorClass }: { title: string; value: string | number; colorClass: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <span className={`w-3 h-3 rounded-full ${colorClass}`}></span>
        </div>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
);

const StatusBadge = ({ status }: { status: RecentRequest['status'] }) => {
    const statusStyles = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Revisions: 'bg-orange-100 text-orange-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>{status}</span>;
};

// --- Main Dashboard Page Component ---
const AdminDashboardPage = () => {
    const [stats, setStats] = useState<Stat | null>(null);
    const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
    const [facilities, setFacilities] = useState<BookedFacility[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/api/admin/dashboard-data');
                setStats(response.data.stats);
                setRecentRequests(response.data.recentRequests);
                setFacilities(response.data.mostBookedFacilities);
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
                setError("Could not load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <AuthenticatedLayout><div>Loading...</div></AuthenticatedLayout>;
    if (error) return <AuthenticatedLayout><div>{error}</div></AuthenticatedLayout>;

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Request Overview</h1>
                <p className="text-gray-500 mt-1">Review the status and information of each request.</p>
            </header>

            {/* Stat Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Requests" value={stats?.total ?? 0} colorClass="bg-gray-400" />
                <StatCard title="Pending" value={stats?.pending ?? 0} colorClass="bg-yellow-400" />
                <StatCard title="Approved" value={stats?.approved ?? 0} colorClass="bg-green-400" />
                <StatCard title="Rejected" value={stats?.rejected ?? 0} colorClass="bg-red-400" />
            </section>

            {/* Recent Requests Table */}
            <section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Recent Requests</h2>
                    <div className="flex gap-2">
                         <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300">View All</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th scope="col" className="px-6 py-3">Incident Title</th>
                                <th scope="col" className="px-6 py-3">Date Submitted</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Feedback</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentRequests.map((request) => (
                                <tr key={request.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{request.incident_title}</td>
                                    <td className="px-6 py-4">{new Date(request.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4"><StatusBadge status={request.status} /></td>
                                    <td className="px-6 py-4">{request.feedback ?? 'N/A'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:underline">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            
            {/* Most Booked Facility */}
            <section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                 <h2 className="text-lg font-semibold text-gray-700 mb-4">Most Booked Facility</h2>
                 <div className="space-y-4">
                    {facilities.map((facility, index) => {
                        const maxTotal = Math.max(...facilities.map(f => f.total), 0);
                        const widthPercentage = maxTotal > 0 ? (facility.total / maxTotal) * 100 : 0;
                        return (
                             <div key={index}>
                                 <div className="flex justify-between items-center mb-1">
                                     <span className="text-sm font-medium text-gray-700">{facility.facility_name}</span>
                                     <span className="text-sm font-medium text-gray-500">{facility.total}</span>
                                 </div>
                                 <div className="w-full bg-gray-200 rounded-full h-2.5">
                                     <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${widthPercentage}%` }}></div>
                                 </div>
                             </div>
                        );
                    })}
                 </div>
            </section>

        </AuthenticatedLayout>
    );
};

export default AdminDashboardPage;
// In: resources/js/pages/StudentConcern/ConcernOverviewPage.tsx

import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import apiClient from '../../lib/api'; 

// --- Icon Components ---
const PlusIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
);
const ViewIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
);
const EditIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
);
const RevertIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
);
const TrendsIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>
);
const ChartIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>
);

// --- Helper Types ---
type RequestStatus = 'Pending' | 'Approved' | 'Revisions' | 'Rejected';

interface ConcernRequest {
    id: number;
    incident_title: string;
    submitted_at: string;
    status: RequestStatus;
    feedback: string | null;
}

interface DashboardStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

// --- Reusable Components ---
const StatCard = ({ title, value, color }: { title: string, value: number, color: string }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex-1">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: RequestStatus }) => {
    const statusStyles: Record<RequestStatus, string> = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Revisions: 'bg-orange-100 text-orange-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>{status}</span>;
};

const ConcernOverviewPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentRequests, setRecentRequests] = useState<ConcernRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('trends');
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await apiClient.get('/api/concerns/overview');

                setStats(response.data.stats);
                setRecentRequests(response.data.recentRequests);

            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Could not load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Concern Overview" />

            <header>
                <h1 className="text-3xl font-bold text-gray-800">Concern Overview</h1>
                <p className="text-gray-500 mt-1">Review the status and information of each concern.</p>
            </header>

            {loading && <div className="text-center mt-8">Loading dashboard...</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mt-6" role="alert">{error}</div>}

            {!loading && !error && stats && (
                <>
                    <section className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Requests" value={stats.total} color="bg-gray-400" />
                        <StatCard title="Pending" value={stats.pending} color="bg-yellow-400" />
                        <StatCard title="Approved" value={stats.approved} color="bg-green-400" />
                        <StatCard title="Rejected" value={stats.rejected} color="bg-red-400" />
                    </section>

                    <section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                            <h2 className="text-lg font-semibold text-gray-700 flex-shrink-0">Recent Requests</h2>
                            <div className="flex items-center gap-2">
                                <Link href={route('student-concern.lodge')} className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 whitespace-nowrap">
                                    <PlusIcon />
                                    New Request
                                </Link>
                                <button className="px-4 py-2 border bg-gray-600 text-white rounded-md text-sm whitespace-nowrap">View All</button>
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
                                            <td className="px-6 py-4">{formatDate(request.submitted_at)}</td>
                                            <td className="px-6 py-4"><StatusBadge status={request.status} /></td>
                                            <td className="px-6 py-4">{request.feedback}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end items-center gap-3">
                                                    {request.status === 'Revisions' && <button className="text-gray-500 hover:text-gray-800"><RevertIcon /></button>}
                                                    {request.status === 'Pending' && <button className="text-gray-500 hover:text-gray-800"><EditIcon /></button>}
                                                    <button className="text-gray-500 hover:text-gray-800"><ViewIcon /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
        </AuthenticatedLayout>
    );
};

export default ConcernOverviewPage;
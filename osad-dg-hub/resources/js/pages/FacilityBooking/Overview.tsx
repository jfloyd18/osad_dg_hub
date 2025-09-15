// In: resources/js/pages/FacilityBooking/Overview.tsx

import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout'; // <-- Use the real layout
import { Head, Link } from '@inertiajs/react'; // <-- Use the real components
import apiClient from '../../lib/api'; 

// --- The mock components are now REMOVED ---

// --- Helper Types ---
type RequestStatus = 'Pending' | 'Approved' | 'Revisions' | 'Rejected';

interface BookingRequest {
    id: number;
    event_name: string;
    submitted_at: string;
    status: RequestStatus;
    feedback: string | null;
}

interface FacilityStat {
    name: string;
    bookings: number;
}

interface DashboardStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

// --- Icon Components (code omitted for brevity) ---
const SearchIcon = ({ className = 'w-5 h-5' }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg> );
const PlusIcon = ({ className = 'w-5 h-5' }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> );
const EditIcon = ({ className = 'w-5 h-5' }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg> );
const ViewIcon = ({ className = 'w-5 h-5' }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg> );

// --- Reusable UI Components (code omitted for brevity) ---
const StatCard = ({ title, value, color }: { title: string, value: number, color: string }) => ( <div className="bg-white p-4 rounded-lg shadow-sm flex-1"><div className="flex justify-between items-start"><div><p className="text-sm text-gray-500">{title}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div><div className={`w-3 h-3 rounded-full ${color}`}></div></div></div> );
const StatusBadge = ({ status }: { status: RequestStatus }) => { const statusStyles: Record<RequestStatus, string> = { Pending: 'bg-yellow-100 text-yellow-800', Approved: 'bg-green-100 text-green-800', Revisions: 'bg-orange-100 text-orange-800', Rejected: 'bg-red-100 text-red-800', }; return <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>{status}</span>; };

// --- Main Page Component ---
const OverviewPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentRequests, setRecentRequests] = useState<BookingRequest[]>([]);
    const [facilities, setFacilities] = useState<FacilityStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Use the apiClient for all authenticated API calls
                const [statsRes, requestsRes, facilitiesRes] = await Promise.all([
                    apiClient.get(`/api/stats`),
                    apiClient.get(`/api/requests`),
                    apiClient.get(`/api/facilities/most-booked`)
                ]);

                setStats(statsRes.data);
                setRecentRequests(requestsRes.data);
                setFacilities(facilitiesRes.data);

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
            <Head title="Request Overview" />
            <header>
                <h1 className="text-3xl font-bold text-gray-800">Request Overview</h1>
                <p className="text-gray-500 mt-1">Review the status and information of each request.</p>
            </header>

            {loading && <div className="text-center mt-8">Loading dashboard...</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mt-6" role="alert">{error}</div>}

            {!loading && !error && stats && (
                <>
                    {/* Stats Cards */}
                    <section className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Requests" value={stats.total} color="bg-gray-400" />
                        <StatCard title="Pending" value={stats.pending} color="bg-yellow-400" />
                        <StatCard title="Approved" value={stats.approved} color="bg-green-400" />
                        <StatCard title="Rejected" value={stats.rejected} color="bg-red-400" />
                    </section>
                    {/* Main Content Grid */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Requests Table */}
                        <section className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                                <h2 className="text-lg font-semibold text-gray-700 flex-shrink-0">Recent Requests</h2>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 w-full">
                                    <div className="relative w-full sm:w-48">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon className="w-5 h-5 text-gray-400" /></span>
                                        <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" />
                                    </div>
                                    <Link href={'/facility-booking/request'} className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 whitespace-nowrap w-full sm:w-auto">
                                        <PlusIcon /> New Request
                                    </Link>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-600">
                                    <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Event Title</th>
                                            <th scope="col" className="px-6 py-3">Date Submitted</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentRequests.map((request) => (
                                            <tr key={request.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{request.event_name}</td>
                                                <td className="px-6 py-4">{formatDate(request.submitted_at)}</td>
                                                <td className="px-6 py-4"><StatusBadge status={request.status} /></td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end items-center gap-3">
                                                        <button className="text-gray-500 hover:text-gray-800"><EditIcon /></button>
                                                        <button className="text-gray-500 hover:text-gray-800"><ViewIcon /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        {/* Most Booked Facility */}
                        <section className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Most Booked Facility</h2>
                            <div className="space-y-4">
                                {facilities.length > 0 ? facilities.map(facility => (
                                    <div key={facility.name}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{facility.name}</span>
                                            <span className="text-sm font-medium text-gray-500">{facility.bookings} bookings</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(facility.bookings / (facilities[0].bookings || 1)) * 100}%` }}></div>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-gray-500">No facility booking data available.</p>}
                            </div>
                        </section>
                    </div>
                </>
            )}
        </AuthenticatedLayout>
    );
};

export default OverviewPage;
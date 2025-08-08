import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// --- Icon Components (can be moved to a shared file) ---
const SearchIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const PlusIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const EditIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

const RevertIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
    </svg>
);

const ViewIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);


// --- Reusable Components ---
const StatCard = ({ title, value, change, color }: { title: string, value: number, change: string, color: string }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex-1">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
        </div>
        <p className="text-xs text-green-500 mt-1">{change}</p>
    </div>
);

const StatusBadge = ({ status }: { status: 'Pending' | 'Approved' | 'Revisions' }) => {
    const statusStyles = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Revisions: 'bg-red-100 text-red-800',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>{status}</span>;
};

// --- Main Page Component ---
const RequestOverviewPage = () => {
    // Mock data - replace with data from your backend
    const recentRequests = [
        { id: 1, title: 'Lost Student ID', date: 'Jan 15, 2025', status: 'Pending', feedback: 'Under review by Student Affairs', actions: ['edit', 'view'] },
        { id: 2, title: 'Library Misconduct', date: 'Jan 10, 2025', status: 'Approved', feedback: 'Incident logged and resolved by staff', actions: ['view'] },
        { id: 3, title: 'Disruption During Class Hours', date: 'Jan 5, 2025', status: 'Revisions', feedback: 'Missing teacher\'s account of the incident', actions: ['view', 'revert'] },
    ];

    const facilities = [
        { name: 'Auditorium', bookings: 36 },
        { name: 'Formville', bookings: 28 },
        { name: 'Room 305', bookings: 26 },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Request Overview" />

            {/* Header */}
            <header>
                <h1 className="text-3xl font-bold text-gray-800">Request Overview</h1>
                <p className="text-gray-500 mt-1">Review the status and information of each request.</p>
            </header>

            {/* Stats Cards */}
            <section className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Requests" value={492} change="+8 new" color="bg-gray-400" />
                <StatCard title="Pending" value={18} change="+5 new" color="bg-yellow-400" />
                <StatCard title="Approved" value={195} change="+3 new" color="bg-green-400" />
                <StatCard title="Rejected" value={33} change="" color="bg-red-400" />
            </section>

            {/* Recent Requests Table */}
            <section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-lg font-semibold text-gray-700 flex-shrink-0">Recent Requests</h2>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 w-full">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-48">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search facility..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                        {/* Action Buttons */}
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm whitespace-nowrap w-full sm:w-auto">Filter by Status</button>
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm whitespace-nowrap w-full sm:w-auto">Sort by Date</button>
                        <Link href={route('facility-booking.request')} className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 whitespace-nowrap w-full sm:w-auto">
                            <PlusIcon />
                            New Request
                        </Link>
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
                                    <td className="px-6 py-4 font-medium text-gray-900">{request.title}</td>
                                    <td className="px-6 py-4">{request.date}</td>
                                    <td className="px-6 py-4"><StatusBadge status={request.status as any} /></td>
                                    <td className="px-6 py-4">{request.feedback}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end items-center gap-3">
                                            {request.actions.includes('revert') && <button className="text-gray-500 hover:text-gray-800"><RevertIcon /></button>}
                                            {request.actions.includes('edit') && <button className="text-gray-500 hover:text-gray-800"><EditIcon /></button>}
                                            {request.actions.includes('view') && <button className="text-gray-500 hover:text-gray-800"><ViewIcon /></button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Most Booked Facility */}
            <section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                        Most Booked Facility
                    </h2>
                 </div>
                 <div className="space-y-4">
                    {facilities.map(facility => (
                        <div key={facility.name}>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">{facility.name}</span>
                                <span className="text-sm font-medium text-gray-500">{facility.bookings}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(facility.bookings / 40) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                 </div>
            </section>

        </AuthenticatedLayout>
    );
};

export default RequestOverviewPage;

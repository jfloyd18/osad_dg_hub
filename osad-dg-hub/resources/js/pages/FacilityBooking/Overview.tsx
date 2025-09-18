import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

// --- Helper Types ---
type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

interface BookingRequest {
    id: number;
    event_name: string;
    submitted_at: string;
    status: RequestStatus;
}

interface PageProps {
    requests: BookingRequest[];
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    flash?: { success?: string; };
}

// --- Reusable UI Components ---
const StatCard = ({ title, value, color }: { title: string, value: number, color: string }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex-1">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`w-3 h-3 rounded-full mt-1 ${color}`}></div>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: RequestStatus }) => {
    const statusStyles: Record<RequestStatus, string> = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status] || ''}`}>{status}</span>;
};

// --- Icon Components ---
const EditIcon = () => ( <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg> );
const ViewIcon = () => ( <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> );

// --- Reusable Success Modal Component ---
const SuccessModal = ({ message, onClose }: { message: string, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-8 rounded-lg max-w-sm w-full shadow-xl text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">SUCCESS!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button onClick={onClose} className="w-full px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Continue</button>
        </div>
    </div>
);


// --- Main Page Component ---
const OverviewPage = ({ requests, stats, flash }: PageProps) => {
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(!!flash?.success);

    // --- DEBUGGING: Check if the flash message is arriving ---
    // Open your browser's developer console (F12) and check the logs.
    console.log("Flash message from controller:", flash);

    useEffect(() => {
        // This ensures the modal appears if the user navigates back to the page
        // with a flash message already present.
        setSuccessModalOpen(!!flash?.success);
    }, [flash]);

    return (
        <AuthenticatedLayout>
            <Head title="Request Overview" />

            {/* The modal is now controlled by the state, which is set by the flash prop */}
            {isSuccessModalOpen && flash?.success && (
                <SuccessModal message={flash.success} onClose={() => setSuccessModalOpen(false)} />
            )}

            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Request Overview</h1>
                    <p className="text-gray-500 mt-1">Review the status and information of each request.</p>
                </div>
                <Link href={route('facility-booking.request')} className="px-5 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 whitespace-nowrap">
                    + New Request
                </Link>
            </header>

            <section className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Requests" value={stats.total} color="bg-gray-400" />
                <StatCard title="Pending" value={stats.pending} color="bg-yellow-400" />
                <StatCard title="Approved" value={stats.approved} color="bg-green-400" />
                <StatCard title="Rejected" value={stats.rejected} color="bg-red-400" />
            </section>
            
            <section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Requests</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">Event Title</th>
                                <th className="px-6 py-3">Date Submitted</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request) => (
                                <tr key={request.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{request.event_name}</td>
                                    <td className="px-6 py-4">{new Date(request.submitted_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4"><StatusBadge status={request.status} /></td>
                                    <td className="px-6 py-4 text-center">
                                        <Link 
                                            href={route('facility-booking.show', request.id)} 
                                            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600"
                                            title={request.status === 'Pending' ? 'Edit Request' : 'View Request'}
                                        >
                                            {request.status === 'Pending' ? <EditIcon /> : <ViewIcon />}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </AuthenticatedLayout>
    );
};

export default OverviewPage;


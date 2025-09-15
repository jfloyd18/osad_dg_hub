// In: resources/js/pages/Admin/RequestOverview.tsx

import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import apiClient from '@/lib/api';
import { PageProps } from '../../types'; // <-- THIS IS THE FIX

// --- Helper Types ---
interface BookingRequest {
    id: number;
    booking_id: string;
    department: string;
    event_date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    // Add other properties from your BookingRequest model as needed
}

// --- Reusable Components ---
const StatusBadge = ({ status }: { status: BookingRequest['status'] }) => {
    const statusStyles = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>{status}</span>;
};

// --- Main Page Component ---
const AdminRequestOverview = () => {
    const [requests, setRequests] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // This would be used to show the details modal
    const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/api/admin/booking-requests');
            setRequests(response.data);
        } catch (err) {
            setError('Failed to load requests.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (requestId: number) => {
        if (!confirm('Are you sure you want to approve this request?')) return;
        try {
            await apiClient.patch(`/api/admin/booking-requests/${requestId}/status`, { status: 'Approved' });
            fetchRequests();
        } catch (err) {
            alert('Failed to approve request.');
        }
    };

    const handleReject = async (requestId: number) => {
        const reason = prompt('Please state the reason for rejection:');
        if (reason === null) return;
        try {
            await apiClient.patch(`/api/admin/booking-requests/${requestId}/status`, { status: 'Rejected', feedback: reason });
            fetchRequests();
        } catch (err) {
            alert('Failed to reject request.');
        }
    };
    
    const handleViewDetails = (request: BookingRequest) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
        alert(`Viewing details for Booking ID: ${request.booking_id}\n(Modal UI not yet implemented)`);
    };

    if (loading) return <AuthenticatedLayout><div>Loading requests...</div></AuthenticatedLayout>;
    if (error) return <AuthenticatedLayout><div>{error}</div></AuthenticatedLayout>;

    return (
        <AuthenticatedLayout>
            <Head title="Admin: Request Overview" />

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Booking Request Overview</h1>
                <p className="text-gray-500 mt-1">Approve or reject pending requests from student organizations.</p>
            </header>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">Booking ID</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Event Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-gray-800">{req.booking_id}</td>
                                    <td className="px-6 py-4">{req.department}</td>
                                    <td className="px-6 py-4">{new Date(req.event_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center gap-4">
                                            {req.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => handleApprove(req.id)} className="font-medium text-green-600 hover:underline">Approve</button>
                                                    <button onClick={() => handleReject(req.id)} className="font-medium text-red-600 hover:underline">Reject</button>
                                                </>
                                            )}
                                            <button onClick={() => handleViewDetails(req)} className="font-medium text-blue-600 hover:underline">Details</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AdminRequestOverview;
// In: resources/js/pages/StudentConcern/ViewWarningsPage.tsx

import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import apiClient from '../../lib/api';

const StatusBadge = ({ status }: { status: string }) => {
    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'resolved':
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'dismissed':
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'Pending';
            case 'resolved':
                return 'Resolved';
            case 'dismissed':
                return 'Dismissed';
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            default:
                return status;
        }
    };

    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(status)}`}>
            {getStatusLabel(status)}
        </span>
    );
};

interface WarningSlip {
    id: number;
    name: string;
    student_id: string;
    section: string;
    violation_type: string;
    details: string;
    date_of_violation: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    message: string;
    data: {
        data: WarningSlip[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        from: number;
        to: number;
    };
}

const ViewWarningsPage = () => {
    const [warnings, setWarnings] = useState<WarningSlip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWarning, setSelectedWarning] = useState<WarningSlip | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10,
    });

    useEffect(() => {
        const fetchWarnings = async () => {
            try {
                setLoading(true);
                console.log('Fetching warnings...');
                
                const response = await apiClient.get('/api/warnings');
                console.log('API Response:', response.data);

                // Handle the response structure from your API
                if (response.data && response.data.data) {
                    if (Array.isArray(response.data.data)) {
                        // If data.data is an array (simple response)
                        setWarnings(response.data.data);
                        setPagination({
                            current_page: 1,
                            last_page: 1,
                            total: response.data.data.length,
                            per_page: response.data.data.length,
                        });
                    } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
                        // If data.data.data exists (paginated response)
                        setWarnings(response.data.data.data);
                        setPagination({
                            current_page: response.data.data.current_page || 1,
                            last_page: response.data.data.last_page || 1,
                            total: response.data.data.total || 0,
                            per_page: response.data.data.per_page || 10,
                        });
                    } else {
                        console.warn('Unexpected data structure:', response.data);
                        setWarnings([]);
                    }
                } else {
                    console.warn('No data field in response:', response.data);
                    setWarnings([]);
                }
                
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch warnings:", err);
                console.error("Error response:", err.response?.data);
                
                if (err.response?.status === 404) {
                    setError("Warning data endpoint not found. Please contact support.");
                } else if (err.response?.status === 500) {
                    setError("Server error occurred. Please try again later.");
                } else {
                    setError("Could not load warning data. Please try again later.");
                }
                setWarnings([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchWarnings();
    }, []);

    const handleViewWarning = (warning: WarningSlip) => {
        setSelectedWarning(warning);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedWarning(null);
        setShowModal(false);
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="View Warnings" />
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">View Warnings</h1>
                    {pagination.total > 0 && (
                        <div className="text-sm text-gray-600">
                            Total: {pagination.total} warning{pagination.total !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
                
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <p className="mt-2 text-gray-600">Loading warnings...</p>
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student Info
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Violation Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {warnings.length > 0 ? (
                                    warnings.map((warning) => (
                                        <tr key={warning.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{warning.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {warning.student_id}</div>
                                                    <div className="text-sm text-gray-500">Section: {warning.section}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {warning.violation_type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(warning.date_of_violation)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <StatusBadge status={warning.status} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                                <div className="truncate" title={warning.details}>
                                                    {warning.details}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => handleViewWarning(warning)}
                                                    className="text-gray-600 hover:text-gray-900 focus:outline-none"
                                                    title="View warning details"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p>No warnings found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Warning Detail Modal */}
                {showModal && selectedWarning && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-3 border-b">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Warning Slip Details
                                </h3>
                                <button
                                    className="text-gray-400 hover:text-gray-600"
                                    onClick={closeModal}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Student Name
                                            </label>
                                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                                {selectedWarning.name}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Student ID
                                            </label>
                                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                                {selectedWarning.student_id}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Section
                                            </label>
                                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                                {selectedWarning.section}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Violation Type
                                            </label>
                                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                                {selectedWarning.violation_type}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date of Violation
                                            </label>
                                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                                {formatDate(selectedWarning.date_of_violation)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Status
                                            </label>
                                            <div className="p-2">
                                                <StatusBadge status={selectedWarning.status} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date Created
                                            </label>
                                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                                {formatDate(selectedWarning.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Incident Details
                                    </label>
                                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                                        {selectedWarning.details}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end pt-4 border-t mt-6">
                                <button
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default ViewWarningsPage;
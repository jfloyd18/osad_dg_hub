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

// Statistics card component
const StatCard = ({ title, value, color }: { title: string, value: number, color: 'gray' | 'yellow' | 'green' | 'red' }) => {
    const colorClasses = {
        gray: 'bg-gray-400',
        yellow: 'bg-yellow-400',
        green: 'bg-green-400',
        red: 'bg-red-400',
    }[color];

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
            <span className={`w-3 h-3 rounded-full ${colorClasses}`}></span>
        </div>
    );
};

// === UTILITY FUNCTION ===
const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
};

// === NEW DETAILS VIEW COMPONENT ===
// This component renders the details page, replacing the table.
const WarningDetailsView = ({ warning, onBack }: { warning: WarningSlip, onBack: () => void }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Warning Slip Details
                    </h3>
                    <StatusBadge status={warning.status} />
                </div>
            </div>

            {/* Body */}
            <div className="mt-6 space-y-6">
                
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Student Name
                        </label>
                        <p className="text-md text-gray-900 font-semibold">
                            {warning.name}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Date of Violation
                        </label>
                        <p className="text-md text-gray-900 font-semibold">
                            {formatDate(warning.date_of_violation)}
                        </p>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Student ID
                        </label>
                        <p className="text-md text-gray-900">
                            {warning.student_id}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Section
                        </label>
                        <p className="text-md text-gray-900">
                            {warning.section}
                        </p>
                    </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Violation Type
                        </label>
                        <p className="text-md text-gray-900 font-semibold">
                            {warning.violation_type}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Date Submitted
                        </label>
                        <p className="text-md text-gray-900">
                            {formatDate(warning.created_at)}
                        </p>
                    </div>
                </div>
                
                {/* Row 4 - Details Block */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                        Incident Details
                    </label>
                    <div className="text-md text-gray-900 bg-gray-50 p-4 rounded-md min-h-[100px] border whitespace-pre-wrap">
                        {warning.details}
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-end pt-6 border-t mt-6">
                <button
                    className="px-5 py-2 bg-gray-700 text-white text-base font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={onBack}
                >
                    Back to Overview
                </button>
            </div>
        </div>
    );
};


// === MAIN PAGE COMPONENT ===
const ViewWarningsPage = () => {
    const [warnings, setWarnings] = useState<WarningSlip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWarning, setSelectedWarning] = useState<WarningSlip | null>(null); // This now controls the view
    // const [showModal, setShowModal] = useState(false); // No longer needed
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

    // Show the details view
    const showDetailsView = (warning: WarningSlip) => {
        setSelectedWarning(warning);
    };

    // Go back to the list view
    const showListView = () => {
        setSelectedWarning(null);
    };

    // Calculate stats
    const totalWarnings = warnings.length;
    const pendingWarnings = warnings.filter(w => w.status.toLowerCase() === 'pending').length;
    const resolvedWarnings = warnings.filter(w => w.status.toLowerCase() === 'resolved').length;
    const dismissedWarnings = warnings.filter(w => w.status.toLowerCase() === 'dismissed').length;

    return (
        <AuthenticatedLayout>
            {/* Dynamically set the Head title based on the view */}
            <Head title={selectedWarning ? "Warning Details" : "View Warnings"} />
            
            {/* This div wraps the entire page content */}
            <div className="p-6 space-y-6">

                {/* CONDITIONAL RENDERING: 
                    If a warning is selected, show details.
                    Otherwise, show the overview (stats + table).
                */}
                {selectedWarning ? (
                    
                    // === DETAILS VIEW ===
                    <WarningDetailsView warning={selectedWarning} onBack={showListView} />

                ) : (
                    
                    // === OVERVIEW VIEW (Stats + Table) ===
                    <>
                        {/* Page Header */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">View Warnings</h1>
                            <p className="text-sm text-gray-600 mt-1">Review the status and information of each warning.</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Warnings" value={totalWarnings} color="gray" />
                            <StatCard title="Pending" value={pendingWarnings} color="yellow" />
                            <StatCard title="Resolved" value={resolvedWarnings} color="green" />
                            <StatCard title="Dismissed" value={dismissedWarnings} color="red" />
                        </div>
                        
                        {/* Main Content Card */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {/* Card Header */}
                            <div className="flex justify-between items-center p-4 border-b">
                                <h2 className="text-lg font-semibold text-gray-800">Recent Warnings</h2>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    <p className="mt-2 text-gray-600">Loading warnings...</p>
                                </div>
                            )}
                            
                            {/* Error State */}
                            {error && (
                                <div className="p-6">
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                        <strong>Error:</strong> {error}
                                    </div>
                                </div>
                            )}

                            {/* Content Table */}
                            {!loading && !error && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Violation
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date of Violation
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
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {warning.violation_type}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowJrap text-sm text-gray-500">
                                                            {formatDate(warning.date_of_violation)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <StatusBadge status={warning.status} />
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                                            <div className="truncate" title={warning.details}>
                                                                {warning.details || '-'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <button
                                                                onClick={() => showDetailsView(warning)} // Updated
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
                                                    <td colSpan={5} className="text-center py-12 text-gray-500">
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
                        </div>
                    </>
                )}
            </div>
            
            {/* Modal has been removed */}

        </AuthenticatedLayout>
    );
};

export default ViewWarningsPage;
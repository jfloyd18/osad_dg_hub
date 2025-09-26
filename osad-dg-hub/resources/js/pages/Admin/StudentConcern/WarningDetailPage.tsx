// In: resources/js/pages/Admin/StudentConcern/WarningDetailPage.tsx

import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import apiClient from '@/lib/api'; // Import the API client

// This interface should match the structure of your Warning model
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
}

// The component receives the 'warning' object as a prop from the controller
const WarningDetailPage = ({ warning }: { warning: WarningSlip }) => {

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'dismissed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Handles updating the status of the warning slip
    const handleStatusUpdate = async (newStatus: 'resolved' | 'dismissed') => {
        // In a real application, you would use a custom modal for confirmation
        // instead of the basic browser confirm().
        try {
            // Send a PATCH request to the API to update the status
            const response = await apiClient.patch(`/api/warnings/${warning.id}/status`, {
                status: newStatus
            });

            if (response.status === 200) {
                // On success, redirect back to the overview page.
                router.get(route('admin.warnings.overview'));
            }
        } catch (error) {
            console.error('Error updating warning status:', error);
            // In a real application, you might show an error notification here.
        }
    };


    return (
        <AuthenticatedLayout>
            <Head title={`Warning Slip #${warning.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Warning Slip Details</h2>
                                    <p className="text-sm text-gray-500">Submitted on {formatDate(warning.created_at)}</p>
                                </div>
                                <span className={`px-4 py-1.5 text-sm font-semibold rounded-full capitalize ${getStatusBadgeClass(warning.status)}`}>
                                    {warning.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {/* Student Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Student Information</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Name</label>
                                        <p className="text-md text-gray-900">{warning.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Student ID</label>
                                        <p className="text-md text-gray-900">{warning.student_id}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Section</label>
                                        <p className="text-md text-gray-900">{warning.section}</p>
                                    </div>
                                </div>

                                {/* Violation Details */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Violation Details</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Violation Type</label>
                                        <p className="text-md text-gray-900">{warning.violation_type}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Date of Violation</label>
                                        <p className="text-md text-gray-900">{formatDate(warning.date_of_violation)}</p>
                                    </div>
                                </div>

                                {/* Details of Violation */}
                                <div className="md:col-span-2">
                                     <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Details of Violation</h3>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-md border">
                                        <p className="text-md text-gray-800 whitespace-pre-wrap">{warning.details}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-10 flex justify-end items-center space-x-4 border-t pt-6">
                                <button
                                    onClick={() => router.get(route('admin.warnings.overview'))}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                                >
                                    Back to Overview
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('dismissed')}
                                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                                >
                                    Dismiss
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('resolved')}
                                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                                >
                                    Resolve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default WarningDetailPage;


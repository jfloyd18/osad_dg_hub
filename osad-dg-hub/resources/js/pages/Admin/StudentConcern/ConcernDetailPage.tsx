// In: resources/js/pages/Admin/StudentConcern/ConcernDetailPage.tsx

import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import apiClient from '@/lib/api';

// This interface matches the 'concern' object
interface IncidentReport {
    id: number;
    incident_title: string;
    details: string;
    status: string;
    created_at: string;
    student_id: string | null;
}

// FIX: Add a new interface for the 'reporter' object
interface Reporter {
    id: number;
    name: string;
    student_id: string;
}

// FIX: The component now accepts both 'concern' and 'reporter' props
const ConcernDetailPage = ({ concern, reporter }: { concern: IncidentReport, reporter: Reporter | null }) => {

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            const response = await apiClient.put(`/api/concerns/${concern.id}/status`, {
                status: newStatus
            });
            
            if (response.status === 200) {
                // On success, redirect back to the overview page
                router.get('/admin/student-concern/overview');
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Could not update the status. Please try again.');
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'on progress': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Incident Report #${concern.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Incident Report Details</h2>
                                    <p className="text-sm text-gray-500">Submitted on {formatDate(concern.created_at)}</p>
                                </div>
                                <span className={`px-4 py-1.5 text-sm font-semibold rounded-full capitalize ${getStatusBadgeClass(concern.status)}`}>
                                    {concern.status}
                                </span>
                            </div>

                            <div className="space-y-6">
                                {/* Reporter Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Reporter Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Student Name</label>
                                            {/* FIX: Display the name from the 'reporter' object if it exists */}
                                            <p className="text-md text-gray-900">{reporter ? reporter.name : 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Student ID</label>
                                            {/* FIX: Display the ID from the 'reporter' object or fall back to the concern's ID */}
                                            <p className="text-md text-gray-900">{reporter ? reporter.student_id : (concern.student_id || 'N/A')}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Details of Incident */}
                                <div>
                                     <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Details of Incident</h3>
                                     <div className="mt-2 p-4 bg-gray-50 rounded-md border">
                                         <p className="text-md text-gray-900 whitespace-pre-wrap">{concern.details}</p>
                                     </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-end items-center space-x-4">
                                <button
                                    onClick={() => router.get('/admin/student-concern/overview')}
                                    className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('Rejected')}
                                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('Resolved')}
                                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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

export default ConcernDetailPage;


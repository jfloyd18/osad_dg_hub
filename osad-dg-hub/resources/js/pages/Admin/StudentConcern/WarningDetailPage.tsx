import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import apiClient from '@/lib/api';

interface WarningSlip {
    id: number;
    name: string;
    student_id: string;
    section: string;
    current_address: string;
    home_address: string;
    mobile_no: string;
    violation_type: string;
    details: string;
    date_of_violation: string;
    status: string;
    created_at: string;
}

const WarningDetailPage = ({ warning }: { warning: WarningSlip }) => {
    const [showDismissModal, setShowDismissModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [dismissReason, setDismissReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleResolve = async () => {
        setIsSubmitting(true);
        try {
            const response = await apiClient.patch(`/api/warnings/${warning.id}/status`, {
                status: 'resolved'
            });
            
            if (response.status === 200) {
                setSuccessMessage('Warning slip has been successfully resolved!');
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Could not update the status. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDismiss = async () => {
        if (!dismissReason.trim()) {
            alert('Please provide a reason for dismissing this warning slip.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiClient.patch(`/api/warnings/${warning.id}/status`, {
                status: 'dismissed'
            });
            
            if (response.status === 200) {
                setShowDismissModal(false);
                setSuccessMessage('Warning slip has been dismissed.');
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error('Failed to dismiss warning:', error);
            alert('Could not dismiss the warning slip. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        router.get('/admin/warnings/overview');
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
            case 'dismissed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Warning Slip Details" />

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

                            <div className="space-y-6">
                                {/* Student Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Student Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                                            <p className="text-md text-gray-900">{warning.name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Student ID</label>
                                            <p className="text-md text-gray-900">{warning.student_id}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Section</label>
                                            <p className="text-md text-gray-900">{warning.section}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
                                            <p className="text-md text-gray-900">{warning.mobile_no}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Current Address</label>
                                            <p className="text-md text-gray-900">{warning.current_address}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Home Address</label>
                                            <p className="text-md text-gray-900">{warning.home_address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Violation Details */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Violation Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Violation Type</label>
                                            <p className="text-md text-gray-900">{warning.violation_type}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Date of Violation</label>
                                            <p className="text-md text-gray-900">{formatDate(warning.date_of_violation)}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Details of Violation */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Details of Violation</h3>
                                    <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                                        <p className="text-md text-gray-900 whitespace-pre-wrap">{warning.details || 'No details provided'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-end items-center space-x-4">
                                <button
                                    onClick={() => router.get('/admin/warnings/overview')}
                                    className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                >
                                    Back to Overview
                                </button>
                                <button
                                    onClick={() => setShowDismissModal(true)}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                    Dismiss
                                </button>
                                <button
                                    onClick={handleResolve}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Resolving...' : 'Resolve'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Success!</h3>
                        <p className="text-gray-600 text-center mb-6">
                            {successMessage}
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={handleSuccessClose}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dismiss Modal with Reason */}
            {showDismissModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dismiss Warning Slip</h3>
                        <p className="text-gray-600 mb-4">
                            Please provide a reason for dismissing this warning slip.
                        </p>
                        <textarea
                            value={dismissReason}
                            onChange={(e) => setDismissReason(e.target.value)}
                            placeholder="Enter reason for dismissal..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowDismissModal(false);
                                    setDismissReason('');
                                }}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDismiss}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Dismissing...' : 'Dismiss'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default WarningDetailPage;
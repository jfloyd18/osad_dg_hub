import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import apiClient from '@/lib/api';

interface IncidentReport {
    id: number;
    incident_title: string;
    details: string;
    status: string;
    incident_date: string;
    created_at: string;
    reporter_by?: string;
}

interface Reporter {
    id: number;
    name: string;
    student_id: string;
}

const ConcernDetailPage = ({ concern, reporter }: { concern: IncidentReport, reporter: Reporter | null }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleResolve = async () => {
        setIsSubmitting(true);
        try {
            const response = await apiClient.put(`/api/concerns/${concern.id}/status`, {
                status: 'Resolved'
            });
            
            if (response.status === 200) {
                setSuccessMessage('Incident report has been successfully resolved!');
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Could not update the status. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!feedback.trim()) {
            alert('Please provide a reason for rejection.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Update status
            await apiClient.put(`/api/concerns/${concern.id}/status`, {
                status: 'Rejected'
            });
            
            // Update feedback
            await apiClient.put(`/api/concerns/${concern.id}/feedback`, {
                feedback: feedback
            });
            
            setShowRejectModal(false);
            setSuccessMessage('Incident report has been rejected and feedback sent to the student.');
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Failed to reject concern:', error);
            alert('Could not reject the concern. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        router.get('/admin/student-concern/overview');
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
            <Head title="Incident Report Details" />

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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Student Name</label>
                                            <p className="text-md text-gray-900">{reporter ? reporter.name : 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Student ID</label>
                                            <p className="text-md text-gray-900">{reporter ? reporter.student_id : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Incident Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Incident Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Incident Title</label>
                                            <p className="text-md text-gray-900">{concern.incident_title || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Incident Date</label>
                                            <p className="text-md text-gray-900">{formatDate(concern.incident_date)}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Details of Incident */}
                                <div>
                                     <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Details of Incident</h3>
                                     <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                                         <p className="text-md text-gray-900 whitespace-pre-wrap">{concern.details || 'No details provided'}</p>
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
                                    onClick={() => setShowRejectModal(true)}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                    Reject
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

            {/* Reject Modal with Feedback */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Incident Report</h3>
                        <p className="text-gray-600 mb-4">
                            Please provide a reason for rejecting this incident report. This will be visible to the student.
                        </p>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Enter reason for rejection..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setFeedback('');
                                }}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Rejecting...' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default ConcernDetailPage;
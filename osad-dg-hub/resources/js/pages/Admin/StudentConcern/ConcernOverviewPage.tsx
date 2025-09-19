import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Import the API client
import apiClient from '@/lib/api'; 

// Define or import your types
interface Concern {
    id: number;
    incident_title: string;
    date_submitted: string;
    status: 'Pending' | 'On Progress' | 'Resolved' | 'Rejected';
    feedback: string;
}

const ConcernOverviewPage = ({ concerns = [] }) => {
    const [concernsList, setConcernsList] = useState<Concern[]>(concerns);

    const [modal, setModal] = useState({
        isOpen: false,
        concernId: null,
        feedback: '',
    });

    const handleStatusChange = async (concernId: number, newStatus: string) => {
        try {
            const response = await apiClient.put(`/api/concerns/${concernId}/status`, { status: newStatus });
            if (response.status === 200) {
                setConcernsList(prev => prev.map(c => 
                    c.id === concernId ? { ...c, status: newStatus } : c
                ));
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const openFeedbackModal = (concernId: number) => {
        const concern = concernsList.find(c => c.id === concernId);
        if (concern) { // Check if a concern was found
            setModal({
                isOpen: true,
                concernId: concernId,
                feedback: concern.feedback || '',
            });
        }
    };

    const closeFeedbackModal = () => {
        setModal({ isOpen: false, concernId: null, feedback: '' });
    };

    const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setModal(prev => ({ ...prev, feedback: e.target.value }));
    };

    const submitFeedback = async () => {
        try {
            const response = await apiClient.put(`/api/concerns/${modal.concernId}/feedback`, { feedback: modal.feedback });
            if (response.status === 200) {
                setConcernsList(prev => prev.map(c => 
                    c.id === modal.concernId ? { ...c, feedback: modal.feedback } : c
                ));
                closeFeedbackModal();
            }
        } catch (error) {
            console.error("Failed to submit feedback:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-200 text-yellow-800';
            case 'On Progress':
                return 'bg-blue-200 text-blue-800';
            case 'Resolved':
                return 'bg-green-200 text-green-800';
            case 'Rejected':
                return 'bg-red-200 text-red-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    // Helper function to format the date
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Concern Overview" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Student Concern Overview</h1>
                
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {concernsList.length > 0 ? (
                                concernsList.map(concern => (
                                    <tr key={concern.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{concern.incident_title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(concern.date_submitted)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(concern.status)}`}>
                                                {concern.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {concern.feedback || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <select
                                                    className="border rounded-md p-1 text-sm"
                                                    value={concern.status}
                                                    onChange={(e) => handleStatusChange(concern.id, e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="On Progress">On Progress</option>
                                                    <option value="Resolved">Resolved</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                                <button
                                                    onClick={() => openFeedbackModal(concern.id)}
                                                    className="text-blue-600 hover:text-blue-900 ml-2"
                                                >
                                                    Add/Edit Feedback
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-500">
                                        No concerns found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Feedback Modal */}
                {modal.isOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                        <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                            <h3 className="text-lg font-bold mb-4">Add/Edit Feedback</h3>
                            <textarea
                                className="w-full h-32 p-2 border rounded-md"
                                value={modal.feedback}
                                onChange={handleFeedbackChange}
                                placeholder="Enter feedback or remarks here..."
                            ></textarea>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={closeFeedbackModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitFeedback}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default ConcernOverviewPage;
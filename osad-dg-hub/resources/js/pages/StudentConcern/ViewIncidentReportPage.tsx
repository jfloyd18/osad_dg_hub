import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import apiClient from '../../lib/api';

interface ViewIncidentReportPageProps {
    concernId: number;
}

interface ConcernDetail {
    id: number;
    incident_title: string;
    details: string;
    incident_date: string;
    status: string;
    feedback: string | null;
    created_at: string;
    updated_at: string;
}

const ViewIncidentReportPage = ({ concernId }: ViewIncidentReportPageProps) => {
    const [concern, setConcern] = useState<ConcernDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchConcern = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get(`/api/concerns/${concernId}`);
                setConcern(response.data);
            } catch (error: any) {
                console.error('Failed to fetch concern:', error);
                setError('Failed to load concern details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConcern();
    }, [concernId]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getStatusBadgeClass = (status: string) => {
        const statusMap: Record<string, string> = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Approved': 'bg-green-100 text-green-800',
            'Rejected': 'bg-red-100 text-red-800',
            'Revisions': 'bg-orange-100 text-orange-800',
        };
        return statusMap[status] || 'bg-gray-100 text-gray-800';
    };

    if (isLoading) {
        return (
            <AuthenticatedLayout>
                <Head title="View Incident Report" />
                <div className="max-w-4xl mx-auto p-6">
                    <div className="text-center">Loading...</div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (error || !concern) {
        return (
            <AuthenticatedLayout>
                <Head title="View Incident Report" />
                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
                        <p>{error || 'Concern not found.'}</p>
                    </div>
                    <Link href="/student-concern/overview" className="text-blue-600 hover:underline">
                        Back to Overview
                    </Link>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="View Incident Report" />
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Incident Report Details</h1>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(concern.status)}`}>
                            {concern.status}
                        </span>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Submitted</label>
                                <p className="text-gray-900">{formatDate(concern.created_at)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Incident</label>
                                <p className="text-gray-900">{formatDate(concern.incident_date)}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Incident Title</label>
                            <p className="text-gray-900 text-lg font-semibold">{concern.incident_title}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                            <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                                <p className="text-gray-900 whitespace-pre-wrap">{concern.details}</p>
                            </div>
                        </div>

                        {concern.feedback && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Feedback</label>
                                <div className="bg-blue-50 rounded-md p-4 border border-blue-200">
                                    <p className="text-gray-900 whitespace-pre-wrap">{concern.feedback}</p>
                                </div>
                            </div>
                        )}

                        {concern.updated_at !== concern.created_at && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                                <p className="text-gray-600 text-sm">{formatDate(concern.updated_at)}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Link 
                            href="/student-concern/overview" 
                            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Back to Overview
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ViewIncidentReportPage;
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import apiClient from '../../lib/api';

interface EditIncidentReportPageProps {
    concernId: number;
}

const EditIncidentReportPage = ({ concernId }: EditIncidentReportPageProps) => {
    const [formData, setFormData] = useState({
        incident_title: '',
        details: '',
        incident_date: '',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const fetchConcern = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get(`/api/concerns/${concernId}`);
                const concern = response.data;

                setFormData({
                    incident_title: concern.incident_title || '',
                    details: concern.details || '',
                    incident_date: concern.incident_date || '',
                });
            } catch (error: any) {
                console.error('Failed to fetch concern:', error);
                setErrorMessage('Failed to load concern details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConcern();
    }, [concernId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus(null);
        setErrorMessage('');

        try {
            await apiClient.put(`/api/concerns/${concernId}`, formData);
            setSubmissionStatus('success');
            
            // Redirect to overview after 2 seconds
            setTimeout(() => {
                router.visit('/student-concern/overview');
            }, 2000);
        } catch (error: any) {
            console.error('Failed to update concern:', error);
            setSubmissionStatus('error');
            setErrorMessage(error.response?.data?.message || 'Failed to update the concern.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <AuthenticatedLayout>
                <Head title="Edit Incident Report" />
                <div className="max-w-3xl mx-auto p-6">
                    <div className="text-center">Loading...</div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Edit Incident Report" />
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Incident Report</h1>
                
                {submissionStatus === 'success' && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6 text-center">
                        <p>Your incident report has been successfully updated!</p>
                        <p className="text-sm mt-1">Redirecting to overview...</p>
                    </div>
                )}

                {submissionStatus === 'error' && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-center">
                        <p>{errorMessage || 'An error occurred. Please try again.'}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="incident_date" className="block text-sm font-medium text-gray-700">Date of Incident</label>
                        <input
                            type="date"
                            id="incident_date"
                            name="incident_date"
                            value={formData.incident_date}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="incident_title" className="block text-sm font-medium text-gray-700">Incident Title</label>
                        <input
                            type="text"
                            id="incident_title"
                            name="incident_title"
                            value={formData.incident_title}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details</label>
                        <textarea
                            id="details"
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            rows={6}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-end gap-4">
                        <Link href="/student-concern/overview" className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Report'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditIncidentReportPage;
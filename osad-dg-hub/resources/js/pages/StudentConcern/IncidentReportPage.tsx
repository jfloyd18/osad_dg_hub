// In: resources/js/pages/StudentConcern/IncidentReportPage.tsx

import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import apiClient from '../../lib/api'; 

const IncidentReportPage = () => {
    const [formData, setFormData] = useState({
        incident_title: '',
        details: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus(null);
        try {
            await apiClient.post('/api/concerns/create', formData);
            setSubmissionStatus('success');
            setFormData({ incident_title: '', details: '' }); // Clear form
        } catch (error) {
            console.error('Failed to submit incident report:', error);
            setSubmissionStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Incident Report" />
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Incident Report</h1>
                
                {submissionStatus === 'success' && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6 text-center">
                        <p>Your incident report has been successfully submitted!</p>
                        <Link href={route('student-concern.overview')} className="mt-2 inline-block font-semibold text-green-700 hover:underline">
                            Go back to Overview
                        </Link>
                    </div>
                )}

                {submissionStatus === 'error' && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-center">
                        <p>An error occurred. Please try again.</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <Link href={route('student-concern.overview')} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default IncidentReportPage;
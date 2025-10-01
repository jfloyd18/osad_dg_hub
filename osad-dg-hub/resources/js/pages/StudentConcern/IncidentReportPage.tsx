import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import apiClient from '../../lib/api'; 

const IncidentReportPage = () => {
    // Get authenticated user from Inertia props
    const { auth } = usePage().props as any;
    
    const [formData, setFormData] = useState({
        incident_title: '',
        details: '',
        report_date: new Date().toISOString().substring(0, 10),
        incident_date: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus(null);
        setErrorMessage('');

        try {
            // Log the user data for debugging
            console.log('Authenticated user:', auth?.user);
            console.log('Student ID:', auth?.user?.student_id);

            // Submit the form data
            const response = await apiClient.post('/api/concerns/create', formData);
            
            console.log('Response:', response.data);
            setSubmissionStatus('success');
            
            // Clear form and reset to current date after successful submission
            setFormData({ 
                incident_title: '', 
                details: '',
                report_date: new Date().toISOString().substring(0, 10),
                incident_date: '',
            }); 
        } catch (error: any) {
            console.error('Failed to submit incident report:', error);
            console.error('Error response:', error.response?.data);
            setSubmissionStatus('error');
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
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
                        <p>{errorMessage || 'An error occurred. Please try again.'}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="report_date" className="block text-sm font-medium text-gray-700">Date of Report</label>
                            <input
                                type="date"
                                id="report_date"
                                name="report_date"
                                value={formData.report_date}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                                readOnly
                            />
                        </div>
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
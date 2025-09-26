// resources/js/pages/Admin/StudentConcern/WarningSlipPage.tsx

import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import apiClient from '../../../lib/api';

const WarningSlipPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        student_id: '',
        section: '',
        current_address: '',
        home_address: '',
        mobile_no: '',
        violation_type: '',
        details: '', // Changed from incident_description to details
        date_of_violation: new Date().toISOString().split('T')[0],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const violationTypes = [
        'Incomplete Uniform',
        'Facility Misuse',
        'Disruptive Behavior',
        'Academic Misconduct',
        'Tardiness',
        'Absence Without Notice',
        'Other'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            // Log the data being sent for debugging
            console.log('Sending data:', formData);
            
            // Using API client to post to the API route
            const response = await apiClient.post('/api/warnings/create', formData);
            
            console.log('Success response:', response.data);
            
            // Reset form on success
            setFormData({
                name: '',
                student_id: '',
                section: '',
                current_address: '',
                home_address: '',
                mobile_no: '',
                violation_type: '',
                details: '',
                date_of_violation: new Date().toISOString().split('T')[0],
            });
            
            // You can add a success notification here
            alert('Warning slip created successfully!');
            
            // Optionally redirect to overview page
            // router.visit('/admin/student-concern/overview');
        } catch (error: any) {
            console.error('Error response:', error.response);
            
            if (error.response?.status === 422) {
                // Validation errors
                const validationErrors = error.response.data.errors;
                const formattedErrors: Record<string, string> = {};
                
                // Convert validation errors to a flat object
                for (const field in validationErrors) {
                    formattedErrors[field] = Array.isArray(validationErrors[field]) 
                        ? validationErrors[field][0] 
                        : validationErrors[field];
                }
                
                setErrors(formattedErrors);
                console.log('Validation errors:', formattedErrors);
            } else {
                alert(error.response?.data?.message || 'An error occurred while creating the warning slip. Please try again.');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Warning Slip" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Warning Slip</h2>
                            
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Warning Slip Report</h3>
                                <p className="text-gray-600 mb-6">Please provide the details of the incident for the student involved.</p>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Section <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="section"
                                                value={formData.section}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                            {errors.section && <p className="text-red-500 text-sm mt-1">{errors.section}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Student ID <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="student_id"
                                                value={formData.student_id}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                            {errors.student_id && <p className="text-red-500 text-sm mt-1">{errors.student_id}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mobile No. <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="mobile_no"
                                                value={formData.mobile_no}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                            {errors.mobile_no && <p className="text-red-500 text-sm mt-1">{errors.mobile_no}</p>}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="current_address"
                                            value={formData.current_address}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.current_address && <p className="text-red-500 text-sm mt-1">{errors.current_address}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Home Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="home_address"
                                            value={formData.home_address}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.home_address && <p className="text-red-500 text-sm mt-1">{errors.home_address}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type of Incident <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="violation_type"
                                            value={formData.violation_type}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select incident type...</option>
                                            {violationTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.violation_type && <p className="text-red-500 text-sm mt-1">{errors.violation_type}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Describe the Incident <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="details"
                                            value={formData.details}
                                            onChange={handleChange}
                                            rows={5}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Provide a detailed description of the incident..."
                                            required
                                        />
                                        {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date of Violation <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="date_of_violation"
                                            value={formData.date_of_violation}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.date_of_violation && <p className="text-red-500 text-sm mt-1">{errors.date_of_violation}</p>}
                                    </div>
                                    
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'SUBMITTING...' : 'SUBMIT REPORT'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default WarningSlipPage;
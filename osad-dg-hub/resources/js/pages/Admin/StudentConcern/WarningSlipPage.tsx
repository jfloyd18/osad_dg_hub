import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// To avoid issues with path aliases like '@/'.
interface StudentData {
    name: string;
    student_id: string;
    section: string;
}

interface WarningSlipPageProps {
    student: StudentData;
    errors: Record<string, string>;
}

export default function WarningSlipPage({ student, errors: validationErrors }: WarningSlipPageProps) {
    const [data, setData] = useState({
        student_name: student?.name || '',
        student_id: student?.student_id || '',
        section: student?.section || '',
        age: '',
        address: '',
        home_address: '',
        mobile_no: '',
        incident_type: '',
        incident_description: '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    return (
        // 👇 FIX: Wrap the entire page content in AuthenticatedLayout
        <AuthenticatedLayout> 
            <Head title="Create Warning Slip" />
            <div className="bg-gray-100 min-h-screen">
                <main className="p-8">
                    <h2 className="font-semibold text-2xl text-gray-800 leading-tight mb-8">
                        Create Warning Slip
                    </h2>
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Warning Slip Report
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Please provide the details of the incident for the student involved.
                                </p>
                                <form action="/admin/warning-slip" method="POST">
                                    <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label htmlFor="student_name" className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                id="student_name"
                                                name="student_name"
                                                type="text"
                                                value={data.student_name}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
                                            <input
                                                id="section"
                                                name="section"
                                                type="text"
                                                value={data.section}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">Student ID</label>
                                            <input
                                                id="student_id"
                                                name="student_id"
                                                type="text"
                                                value={data.student_id}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                                            <input
                                                id="age"
                                                name="age"
                                                type="number"
                                                value={data.age}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Current address</label>
                                            <input
                                                id="address"
                                                name="address"
                                                type="text"
                                                value={data.address}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="mobile_no" className="block text-sm font-medium text-gray-700">Mobile no.</label>
                                            <input
                                                id="mobile_no"
                                                name="mobile_no"
                                                type="text"
                                                value={data.mobile_no}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="home_address" className="block text-sm font-medium text-gray-700">Home address</label>
                                            <input
                                                id="home_address"
                                                name="home_address"
                                                type="text"
                                                value={data.home_address}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="incident_type" className="block text-sm font-medium text-gray-700">Type of Incident</label>
                                            <input
                                                id="incident_type"
                                                name="incident_type"
                                                type="text"
                                                placeholder="e.g., Incomplete Uniform, Facility Misuse"
                                                value={data.incident_type}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="incident_description" className="block text-sm font-medium text-gray-700">Describe the Incident</label>
                                            <textarea
                                                id="incident_description"
                                                name="incident_description"
                                                rows={4}
                                                value={data.incident_description}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end mt-8">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                                        >
                                            Submit Report
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
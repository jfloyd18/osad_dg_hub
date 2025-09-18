import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

// --- Type Definitions ---
interface StudentData {
    name: string;
    student_id: string;
    section: string;
}

interface PageProps {
    student: StudentData;
    flash?: {
        success?: string;
    };
}

// --- Reusable Component ---
const FormInput = ({ id, label, ...props }: { id: string; label: string; [key: string]: any }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} className="w-full border-gray-300 rounded-md shadow-sm read-only:bg-gray-100" {...props} />
    </div>
);

// --- Main Page Component ---
const WarningSlipPage = ({ student, flash }: PageProps) => {
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        age: '',
        current_address: '',
        home_address: '',
        mobile_no: '',
        violation_type: '',
        details: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('student-concern.warning-slip.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Warning Slip Report" />

            {/* --- FIX IS HERE: Added a max-width and centering container --- */}
            <div className="max-w-4xl mx-auto">
                <div className="w-full bg-white p-6 rounded-lg shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Warning Slip Report</h1>
                    <p className="text-gray-600 mb-6">Your personal information is pre-filled. Please provide the details of the incident below.</p>
                    
                    {recentlySuccessful && flash?.success && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
                            {flash.success}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Pre-filled, non-editable student data */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput id="name" label="Name" value={student.name} readOnly />
                            <FormInput id="section" label="Section" value={student.section} readOnly />
                            <FormInput id="student_id" label="Student ID" value={student.student_id} readOnly />
                            <FormInput id="age" label="Age" type="number" value={data.age} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('age', e.target.value)} required />
                        </div>
                        
                        {/* Editable fields for the student to fill */}
                        <FormInput id="current_address" label="Current address" value={data.current_address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('current_address', e.target.value)} required />
                        <FormInput id="home_address" label="Home address" value={data.home_address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('home_address', e.target.value)} required />
                        <FormInput id="mobile_no" label="Mobile no." value={data.mobile_no} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('mobile_no', e.target.value)} required />
                        
                        <div className="border-t pt-4">
                            <h2 className="text-lg font-semibold text-gray-700">Incident Details</h2>
                            <div className="mt-2">
                                 <label htmlFor="violation_type" className="block text-sm font-medium text-gray-700 mb-1">Type of Incident</label>
                                 <input id="violation_type" className="w-full border-gray-300 rounded-md shadow-sm" value={data.violation_type} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('violation_type', e.target.value)} required placeholder="e.g., Incomplete Uniform, Facility Misuse"/>
                                 {errors.violation_type && <p className="text-sm text-red-600 mt-1">{errors.violation_type}</p>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Describe the Incident</label>
                                <textarea id="details" rows={5} className="w-full border-gray-300 rounded-md shadow-sm" value={data.details} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('details', e.target.value)} required />
                                {errors.details && <p className="text-sm text-red-600 mt-1">{errors.details}</p>}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button type="submit" className="px-8 py-2 bg-[#A13A3A] text-white rounded-md shadow-sm hover:bg-red-700" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit Report'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default WarningSlipPage;
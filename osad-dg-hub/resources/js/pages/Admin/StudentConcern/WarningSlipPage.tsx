import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

// --- Type Definitions ---
interface Warning {
    id: number;
    violation_type: string;
    status: 'Pending' | 'Resolved';
}

interface Trend {
    violation_type: string;
    count: number;
}

interface PageProps {
    recentWarnings: Warning[];
    concernTrends: Trend[];
    flash?: {
        success?: string;
    };
}

// --- Reusable Components ---
const StatusBadge = ({ status }: { status: string }) => {
    const styles: { [key: string]: string } = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Resolved: 'bg-green-100 text-green-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
};

const FormInput = ({ id, label, ...props }: { id: string; label: string; [key: string]: any }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} className="w-full border-gray-300 rounded-md shadow-sm" {...props} />
    </div>
);

// --- Main Page Component ---
const WarningSlipPage = ({ recentWarnings, concernTrends, flash }: PageProps) => {
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        name: '',
        section: '',
        student_id: '',
        age: '',
        current_address: '',
        home_address: '',
        mobile_no: '',
        violation_type: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.warning-slip.store'), {
            onSuccess: () => reset(),
        });
    };

    const totalTrends = concernTrends.reduce((sum, trend) => sum + trend.count, 0);

    return (
        <AuthenticatedLayout>
            <Head title="Issue Warning Slip" />

            {recentlySuccessful && flash?.success && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
                    {flash.success}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Form Section */}
                <div className="flex-grow bg-white p-6 rounded-lg shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Issue Warning Slip</h1>
                    <p className="text-gray-600 mb-6">Fill up all the necessary student and violation information below.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* --- FIX IS HERE: Added event types --- */}
                            <FormInput id="name" label="Name (ex. Cruz, Juan A.)" value={data.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)} required />
                            <FormInput id="section" label="Section (ex. BSIT-2A)" value={data.section} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('section', e.target.value)} required />
                            <FormInput id="student_id" label="Student ID:" value={data.student_id} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('student_id', e.target.value)} required />
                            <FormInput id="age" label="Age:" type="number" value={data.age} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('age', e.target.value)} required />
                        </div>
                        <FormInput id="current_address" label="Current address:" value={data.current_address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('current_address', e.target.value)} required />
                        <FormInput id="home_address" label="Home address:" value={data.home_address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('home_address', e.target.value)} required />
                        <FormInput id="mobile_no" label="Mobile no." value={data.mobile_no} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('mobile_no', e.target.value)} required />
                        <FormInput id="violation_type" label="Violation Type" value={data.violation_type} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('violation_type', e.target.value)} required placeholder="e.g., Incomplete Uniform" />

                        <div className="pt-4 flex justify-end">
                            <button type="submit" className="px-8 py-2 bg-[#A13A3A] text-white rounded-md shadow-sm hover:bg-red-700" disabled={processing}>
                                {processing ? 'Submitting...' : 'Issue Slip'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar Widgets */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="font-bold text-lg mb-4">Recent Warnings</h2>
                        <ul className="space-y-3">
                            {recentWarnings.map(warning => (
                                <li key={warning.id} className="flex justify-between items-center text-sm">
                                    <span>{warning.violation_type}</span>
                                    <StatusBadge status={warning.status} />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="font-bold text-lg mb-4">Concern Trends</h2>
                        <ul className="space-y-3">
                            {concernTrends.map(trend => (
                                <li key={trend.violation_type} className="text-sm">
                                    <p className="mb-1">{trend.violation_type}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-red-600 h-2 rounded-full" style={{ width: `${totalTrends > 0 ? (trend.count / totalTrends) * 100 : 0}%` }}></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default WarningSlipPage;


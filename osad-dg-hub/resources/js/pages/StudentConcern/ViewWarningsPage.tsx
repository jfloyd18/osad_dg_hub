// In: resources/js/pages/StudentConcern/ViewWarningsPage.tsx

import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import apiClient from '../../lib/api'; 

const StatusBadge = ({ status }: { status: 'Pending' | 'Approved' | 'Rejected' }) => {
    const statusStyles = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>{status}</span>;
};

interface WarningSlip {
    id: number;
    name: string;
    student_id: string;
    section: string;
    violation_type: string;
    date_of_violation: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

const ViewWarningsPage = () => {
    const [warnings, setWarnings] = useState<WarningSlip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWarnings = async () => {
            try {
                const response = await apiClient.get('/api/warnings');
                setWarnings(response.data);
            } catch (err) {
                console.error("Failed to fetch warnings:", err);
                setError("Could not load warning data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchWarnings();
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="View Warnings" />
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">View Warnings</h1>
                
                {loading && <div className="text-center">Loading warnings...</div>}
                {error && <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>}

                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Violation Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {warnings.length > 0 ? (
                                    warnings.map((warning) => (
                                        <tr key={warning.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{warning.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warning.violation_type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(warning.date_of_violation).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <StatusBadge status={warning.status} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-gray-500">No warnings found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default ViewWarningsPage;
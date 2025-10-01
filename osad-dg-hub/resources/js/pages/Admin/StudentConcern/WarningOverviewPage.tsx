import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import apiClient from '@/lib/api';

interface WarningSlip {
    id: number;
    name: string;
    student_id: string;
    section: string;
    violation_type: string;
    details: string;
    date_of_violation: string;
    status: string;
    created_at: string;
    updated_at: string;
}

const WarningOverviewPage = () => {
    const [warnings, setWarnings] = useState<WarningSlip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWarnings = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/api/warnings');
                
                let warningData: WarningSlip[] = [];
                
                if (response.data && response.data.data) {
                    if (Array.isArray(response.data.data)) {
                        warningData = response.data.data;
                    } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
                        warningData = response.data.data.data;
                    }
                }
                
                setWarnings(warningData);
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch warnings:", err);
                setError("Could not load warning data. Please try again later.");
                setWarnings([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchWarnings();
    }, []);

    const handleViewClick = (warningId: number) => {
        router.get(`/admin/warnings/${warningId}`);
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'N/A';
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'dismissed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Warning Slip Overview" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Warning Slip Overview</h2>
                            <p className="text-gray-600 mb-8">Review and manage student warning slips.</p>
                            
                            {loading && (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                                    <p className="mt-4 text-gray-600">Loading warning slips...</p>
                                </div>
                            )}
                            
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                                    <strong className="font-semibold">Error:</strong> {error}
                                </div>
                            )}

                            {!loading && !error && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Violation Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date Submitted
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {warnings.length > 0 ? (
                                                warnings.map((warning) => (
                                                    <tr key={warning.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900">{warning.violation_type}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500">{formatDate(warning.created_at)}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadgeClass(warning.status)}`}>
                                                                {warning.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <button
                                                                onClick={() => handleViewClick(warning.id)}
                                                                className="text-blue-600 hover:text-blue-900 font-medium text-sm transition-colors"
                                                            >
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="text-center py-12 text-gray-500">
                                                        No warning slips found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default WarningOverviewPage;
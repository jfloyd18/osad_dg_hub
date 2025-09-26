// In: resources/js/pages/Admin/StudentConcern/WarningOverviewPage.tsx

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
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        dismissed: 0
    });

    useEffect(() => {
        const fetchWarnings = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/api/warnings');
                
                let warningData: WarningSlip[] = [];
                
                // Handle different possible API response structures
                if (response.data && response.data.data) {
                    if (Array.isArray(response.data.data)) {
                        warningData = response.data.data;
                    } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
                        warningData = response.data.data.data;
                    }
                }
                
                setWarnings(warningData);
                
                // Calculate stats
                const total = warningData.length;
                const pending = warningData.filter(w => w.status.toLowerCase() === 'pending').length;
                const resolved = warningData.filter(w => w.status.toLowerCase() === 'resolved').length;
                const dismissed = warningData.filter(w => w.status.toLowerCase() === 'dismissed').length;
                
                setStats({ total, pending, resolved, dismissed });
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
        // Use Inertia's router to navigate to the warning details page.
        // Make sure you have a route like `admin/warnings/{id}` defined in your Laravel routes.
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

    const getStatusLabel = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Warning Slip Overview" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Warning Slip Overview</h2>
                            <p className="text-gray-600 mb-8">Review the status and information of each warning slip.</p>
                            
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Warnings</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                                        <div>
                                            <p className="text-sm text-gray-600">Pending</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                        <div>
                                            <p className="text-sm text-gray-600">Resolved</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                                        <div>
                                            <p className="text-sm text-gray-600">Dismissed</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.dismissed}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Warnings Table */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Warnings</h3>
                                
                                {loading && (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                        <p className="mt-2 text-gray-600">Loading warnings...</p>
                                    </div>
                                )}
                                
                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                        <strong>Error:</strong> {error}
                                    </div>
                                )}

                                {!loading && !error && (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Student Info
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Violation Type
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date Submitted
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {warnings.length > 0 ? (
                                                    warnings.map((warning) => (
                                                        <tr key={warning.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{warning.name}</div>
                                                                    <div className="text-sm text-gray-500">ID: {warning.student_id}</div>
                                                                    <div className="text-sm text-gray-500">Section: {warning.section}</div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {warning.violation_type}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatDate(warning.created_at)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(warning.status)}`}>
                                                                    {getStatusLabel(warning.status)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                                <button
                                                                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                                                    onClick={() => handleViewClick(warning.id)}
                                                                >
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={5} className="text-center py-8 text-gray-500">
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
            </div>
        </AuthenticatedLayout>
    );
};

export default WarningOverviewPage;


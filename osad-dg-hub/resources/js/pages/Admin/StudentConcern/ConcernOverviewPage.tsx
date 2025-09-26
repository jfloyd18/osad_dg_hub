// In: resources/js/pages/Admin/StudentConcern/ConcernOverviewPage.tsx

import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout'; // Fix: Reverted to aliased path
import { Head, router } from '@inertiajs/react';
import apiClient from '@/lib/api'; // Fix: Reverted to aliased path

interface IncidentReport {
    id: number;
    incident_title: string;
    student_name: string;
    student_id: string;
    incident_details: string;
    status: string;
    created_at: string;
    updated_at: string;
}

const IncidentReportsPage = () => {
    const [incidents, setIncidents] = useState<IncidentReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/api/concerns/overview');
                
                if (response.data && Array.isArray(response.data.data)) {
                    setIncidents(response.data.data);
                } else if (Array.isArray(response.data)) {
                     setIncidents(response.data);
                } else {
                    console.error("Unexpected API response structure:", response.data);
                    setIncidents([]);
                }

                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch incident reports:", err);
                setError("Could not load incident reports. Please try again later.");
                setIncidents([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchIncidents();
    }, []);

    const handleViewClick = (incidentId: number) => {
        router.get(`/admin/concerns/${incidentId}`);
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
        if (!status) return '';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Incident Reports" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Concern Overview</h2>
                            <p className="text-gray-600 mb-8">Review and manage student incident reports and concerns.</p>

                            {/* Incident Reports Table */}
                            <div>
                                {loading && (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                        <p className="mt-2 text-gray-600">Loading incident reports...</p>
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
                                                        Incident Title
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date Submitted
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {incidents.length > 0 ? (
                                                    incidents.map((incident) => (
                                                        <tr key={incident.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{incident.incident_title}</div>
                                                                    {incident.student_name && (
                                                                        <div className="text-sm text-gray-500">
                                                                            Student: {incident.student_name}
                                                                            {incident.student_id && ` (${incident.student_id})`}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatDate(incident.created_at)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(incident.status)}`}>
                                                                    {getStatusLabel(incident.status)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <button
                                                                    onClick={() => handleViewClick(incident.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="text-center py-8 text-gray-500">
                                                            No incident reports found.
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

export default IncidentReportsPage;


import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Helper Types (from Laravel) ---
type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

interface BookingRequest {
    id: number;
    event_name: string;
    submitted_at: string;
    status: RequestStatus;
    feedback: string | null;
    department?: string;
    purpose?: string;
}

interface MostBookedFacility {
    facility_name: string;
    bookings: number;
}

interface PageProps {
    stats: { total: number; pending: number; approved: number; rejected: number; };
    recentRequests: BookingRequest[];
    mostBooked: MostBookedFacility[];
}

// --- Toast Notification Component ---
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    
    React.useEffect(() => {
        // Trigger animation on mount
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
            {type === 'success' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            )}
            <span className="font-medium">{message}</span>
            <button onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
            }} className="ml-2 hover:opacity-80">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

// --- Reusable Components ---
const StatCard = ({ title, value, colorClass }: { title: string; value: number; colorClass: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <p className="text-sm text-gray-600">{title}</p>
            <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
        </div>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
);

const StatusBadge = ({ status }: { status: RequestStatus }) => {
    const styles = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
};

// --- Main Page Component ---
const AdminRequestOverview = ({ stats, recentRequests, mostBooked }: PageProps) => {
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [isRejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const { data, setData, processing } = useForm({
        feedback: '',
    });

    const handleOpenDetails = (request: BookingRequest) => {
        setSelectedRequest(request);
        setDetailsModalOpen(true);
    };

    const handleApprove = () => {
        if (!selectedRequest) return;
        
        router.patch(`/api/admin/booking-requests/${selectedRequest.id}/status`, {
            status: 'Approved'
        }, {
            onSuccess: () => {
                setDetailsModalOpen(false);
                setToast({ message: 'Booking request approved successfully!', type: 'success' });
                // Refresh the page data without full reload
                router.reload({ only: ['stats', 'recentRequests'] });
            },
            onError: () => {
                setToast({ message: 'Failed to approve booking request', type: 'error' });
            },
            preserveState: false,
            preserveScroll: true,
        });
    };

    const handleOpenRejection = () => {
        setDetailsModalOpen(false);
        setRejectionModalOpen(true);
    };

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;
        
        router.patch(`/api/admin/booking-requests/${selectedRequest.id}/status`, {
            status: 'Rejected',
            feedback: data.feedback
        }, {
            onSuccess: () => {
                setRejectionModalOpen(false);
                setData('feedback', ''); // Reset feedback
                setToast({ message: 'Booking request rejected successfully!', type: 'success' });
                router.reload({ only: ['stats', 'recentRequests'] });
            },
            onError: () => {
                setToast({ message: 'Failed to reject booking request', type: 'error' });
            },
            preserveState: false,
            preserveScroll: true,
        });
    };

    // Enhanced Chart Data with better styling
    const chartData = {
        labels: mostBooked.map(f => {
            // Ensure facility names are properly displayed
            const name = f.facility_name || 'Unknown Facility';
            // Truncate long names for better display
            return name.length > 20 ? name.substring(0, 20) + '...' : name;
        }),
        datasets: [{
            label: 'Number of Bookings',
            data: mostBooked.map(f => f.bookings),
            backgroundColor: 'rgba(220, 38, 38, 0.8)',
            borderColor: 'rgba(220, 38, 38, 1)',
            borderWidth: 1,
            borderRadius: 4,
            barThickness: 30, // Fixed bar thickness
            maxBarThickness: 40, // Maximum bar thickness
        }],
    };

    const chartOptions = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 4,
                callbacks: {
                    label: (context: any) => {
                        return `Bookings: ${context.parsed.x}`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    stepSize: 1,
                    font: {
                        size: 12,
                    }
                }
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 13,
                        weight: 500,
                    },
                    color: '#374151',
                }
            }
        },
        layout: {
            padding: {
                left: 10,
                right: 20,
                top: 10,
                bottom: 10
            }
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Request Overview" />
            
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Request Overview</h1>
                <p className="text-gray-500 mt-1">Review the status and information of each request.</p>
            </header>

            {/* Stats Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Requests" value={stats.total} colorClass="bg-gray-400" />
                <StatCard title="Pending" value={stats.pending} colorClass="bg-yellow-400" />
                <StatCard title="Approved" value={stats.approved} colorClass="bg-green-400" />
                <StatCard title="Rejected" value={stats.rejected} colorClass="bg-red-500" />
            </section>

            {/* Recent Requests Table */}
            <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Requests</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">Event Name</th>
                                <th className="px-6 py-3">Date Submitted</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Feedback</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentRequests.length > 0 ? (
                                recentRequests.map((req) => (
                                    <tr key={req.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{req.event_name}</td>
                                        <td className="px-6 py-4">{new Date(req.submitted_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                        <td className="px-6 py-4">{req.feedback ?? 'N/A'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleOpenDetails(req)} 
                                                className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No booking requests found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Most Booked Facility Chart */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700 mb-6">Most Booked Facilities</h2>
                {mostBooked.length > 0 ? (
                    <div style={{ height: `${Math.max(200, mostBooked.length * 60)}px` }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No booking data available
                    </div>
                )}
            </section>

            {/* Details Modal */}
            {isDetailsModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 p-4">
                    <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Facility Booking Details</h2>
                        <div className="space-y-3">
                            <p><strong className="text-gray-700">Event:</strong> {selectedRequest.event_name}</p>
                            <p><strong className="text-gray-700">Status:</strong> <StatusBadge status={selectedRequest.status} /></p>
                            <p><strong className="text-gray-700">Submitted:</strong> {new Date(selectedRequest.submitted_at).toLocaleString()}</p>
                            {selectedRequest.department && (
                                <p><strong className="text-gray-700">Department:</strong> {selectedRequest.department}</p>
                            )}
                            {selectedRequest.purpose && (
                                <p><strong className="text-gray-700">Purpose:</strong> {selectedRequest.purpose}</p>
                            )}
                            {selectedRequest.feedback && (
                                <p><strong className="text-gray-700">Feedback:</strong> {selectedRequest.feedback}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-4 mt-8">
                            <button 
                                onClick={() => setDetailsModalOpen(false)} 
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                            >
                                Go Back
                            </button>
                            {selectedRequest.status === 'Pending' && (
                                <>
                                    <button 
                                        onClick={handleOpenRejection} 
                                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                                    >
                                        Reject
                                    </button>
                                    <button 
                                        onClick={handleApprove} 
                                        disabled={processing} 
                                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Processing...' : 'Approve'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {isRejectionModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 p-4">
                    <form onSubmit={handleRejectSubmit} className="bg-white p-8 rounded-lg max-w-md w-full shadow-xl">
                        <h2 className="text-lg font-bold mb-4">Reason for Rejection</h2>
                        <textarea
                            value={data.feedback}
                            onChange={(e) => setData('feedback', e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            rows={4}
                            placeholder="Please provide a reason for rejection..."
                            required
                        />
                        <div className="flex justify-end gap-4 mt-4">
                            <button 
                                type="button" 
                                onClick={() => {
                                    setRejectionModalOpen(false);
                                    setData('feedback', '');
                                }} 
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : 'Proceed'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </AuthenticatedLayout>
    );
};

export default AdminRequestOverview;
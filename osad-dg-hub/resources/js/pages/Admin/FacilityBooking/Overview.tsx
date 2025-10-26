import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Download, FileText } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Helper Types ---
type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

interface BookingRequest {
    id: number;
    booking_id?: string;
    event_name: string;
    submitted_at: string;
    status: RequestStatus;
    feedback: string | null;
    department: string;
    organization: string;
    purpose: string;
    contact_no: string;
    event_start: string;
    event_end: string;
    estimated_people: number;
    facility_name: string;
    person_responsible: string;
    moderator: string;
    activity_plan_path?: string;
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
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);

    const { data, setData, patch, processing, reset } = useForm({
        status: '' as RequestStatus | '',
        feedback: '',
    });
    
    // --- Handlers ---
    const handleOpenDetails = (request: BookingRequest) => {
        setSelectedRequest(request);
        setDetailsModalOpen(true);
    };

    const handleCloseAllModals = () => {
        setDetailsModalOpen(false);
        setRejectionModalOpen(false);
        setSelectedRequest(null);
        reset();
    };

    const handleApprove = () => {
        if (!selectedRequest) return;
        setData('status', 'Approved');
        patch(`/admin/booking-requests/${selectedRequest.id}/status`, {
            preserveScroll: true,
            onSuccess: () => {
                handleCloseAllModals();
                setSuccessModalOpen(true);
            },
            onError: (err) => console.error("Error approving request:", err),
        });
    };

    const handleOpenRejection = () => {
        setDetailsModalOpen(false);
        setRejectionModalOpen(true);
    };
    
    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;
        setData('status', 'Rejected');
        patch(`/admin/booking-requests/${selectedRequest.id}/status`, {
            preserveScroll: true,
            onSuccess: () => {
                handleCloseAllModals();
                setSuccessModalOpen(true);
            },
            onError: (err) => console.error("Error rejecting request:", err),
        });
    };

    const handleSuccessContinue = () => {
        setSuccessModalOpen(false);
        router.reload({ only: ['stats', 'recentRequests', 'mostBooked'] });
    }
    
    // --- Chart Configuration ---
    const chartData = {
        labels: mostBooked.map(f => f.facility_name || 'Facility Name Missing'),
        datasets: [{
            label: 'Bookings',
            data: mostBooked.map(f => f.bookings),
            backgroundColor: '#A13A3A',
            borderColor: '#8B2C2C',
            borderWidth: 1,
            borderRadius: 5,
            barThickness: 25,
        }],
    };

    const chartOptions = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { beginAtZero: true, grid: { display: false }, ticks: { stepSize: 1 } },
            y: { grid: { display: false } }
        },
    };
    
    // --- Helper Functions for Formatting ---
    const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const getBookingId = (request: BookingRequest) => request.booking_id || `BK-${String(request.id).padStart(6, '0')}`;

    return (
        <AuthenticatedLayout>
            <Head title="Request Overview" />
            
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Request Overview</h1>
                <p className="text-gray-500 mt-1">Review the status and information of each request.</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Requests" value={stats.total} colorClass="bg-gray-400" />
                <StatCard title="Pending" value={stats.pending} colorClass="bg-yellow-400" />
                <StatCard title="Approved" value={stats.approved} colorClass="bg-green-400" />
                <StatCard title="Rejected" value={stats.rejected} colorClass="bg-red-500" />
            </section>

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
                                    <tr key={req.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-bold text-gray-900">{req.event_name}</td>
                                        <td className="px-6 py-4">{formatDate(req.submitted_at)}</td>
                                        <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                        <td className="px-6 py-4">{req.feedback ?? 'N/A'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleOpenDetails(req)} 
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">No requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700 mb-6">Most Booked Facilities</h2>
                {mostBooked.length > 0 ? (
                    <div style={{ height: `${Math.max(200, mostBooked.length * 50)}px` }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">No booking data available.</div>
                )}
            </section>

            {/* Enhanced Details Modal */}
            {isDetailsModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl shadow-xl transform transition-all max-h-[90vh] overflow-y-auto">
                       <div className="bg-gradient-to-r from-[#A13A3A] to-[#8B2C2C] p-6 rounded-t-lg sticky top-0 z-10">
                           <h2 className="text-2xl font-bold text-white">Facility Booking Details</h2>
                           <p className="text-white/80 text-sm mt-1">Review all information before approval</p>
                       </div>
                       
                       <div className="p-6 space-y-6">
                            {/* Booking ID Card */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border-l-4 border-[#A13A3A]">
                                <label className="text-xs text-gray-500 uppercase font-semibold">Booking ID</label>
                                <p className="text-2xl font-bold text-gray-900 mt-1">#{getBookingId(selectedRequest)}</p>
                            </div>

                            {/* Event and Facility Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Event Name</label>
                                        <p className="p-3 border border-gray-200 rounded-md bg-gray-50 font-medium">{selectedRequest.event_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Facility</label>
                                        <p className="p-3 border border-gray-200 rounded-md bg-gray-50 font-medium">{selectedRequest.facility_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Event Date</label>
                                        <p className="p-3 border border-gray-200 rounded-md bg-gray-50">{formatDate(selectedRequest.event_start)}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Time</label>
                                        <p className="p-3 border border-gray-200 rounded-md bg-gray-50">{`${formatTime(selectedRequest.event_start)} - ${formatTime(selectedRequest.event_end)}`}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Department</label>
                                        <p className="p-3 border border-gray-200 rounded-md bg-gray-50">{selectedRequest.department}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Organization</label>
                                        <p className="p-3 border border-gray-200 rounded-md bg-gray-50">{selectedRequest.organization}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Person Responsible</label>
                                        <p className="p-3 border border-gray-200 rounded-md bg-gray-50">{selectedRequest.person_responsible}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Contact Details</label>
                                        <p className="p-3 border border-gray-200 rounded-md bg-gray-50">{selectedRequest.contact_no}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Expected Participants */}
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Expected Participants</label>
                                <p className="p-3 border border-gray-200 rounded-md bg-gray-50 font-medium">{selectedRequest.estimated_people}</p>
                            </div>

                            {/* Purpose */}
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Purpose</label>
                                <textarea 
                                    className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 resize-none" 
                                    value={selectedRequest.purpose} 
                                    readOnly 
                                    rows={4}
                                />
                            </div>

                            {/* Activity Plan */}
                            {selectedRequest.activity_plan_path && (
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold block mb-2">Activity Plan</label>
                                    <div className="flex items-center p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg hover:shadow-md transition">
                                        <FileText className="text-red-600 mr-4" size={36} />
                                        <div className="flex-1">
                                            <p className="text-base font-bold text-gray-800">Activity Plan Document</p>
                                            <p className="text-sm text-gray-600">PDF File</p>
                                        </div>
                                        <a 
                                            href={selectedRequest.activity_plan_path} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
                                        >
                                            <Download size={18} className="mr-2" />
                                            Download
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Adviser/Moderator */}
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Adviser/Moderator</label>
                                <p className="p-3 border border-gray-200 rounded-md bg-gray-50">{selectedRequest.moderator}</p>
                                <p className="text-xs text-gray-500 mt-1 italic">Digital signature on record</p>
                            </div>
                       </div>

                       {/* Action Footer */}
                       <div className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-lg border-t sticky bottom-0">
                            <button 
                                onClick={handleCloseAllModals} 
                                className="px-6 py-2.5 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium transition"
                            >
                                Go Back
                            </button>
                            {selectedRequest.status === 'Pending' && (
                                <>
                                    <button 
                                        onClick={handleOpenRejection} 
                                        className="px-6 py-2.5 rounded-md bg-red-600 text-white hover:bg-red-700 font-bold transition shadow-md"
                                    >
                                        Reject
                                    </button>
                                    <button 
                                        onClick={handleApprove} 
                                        disabled={processing} 
                                        className="px-6 py-2.5 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition shadow-md"
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
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                    <form onSubmit={handleRejectSubmit} className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
                        <h2 className="text-lg font-bold mb-4">State Rejection Reason</h2>
                        <textarea
                            value={data.feedback}
                            onChange={(e) => setData('feedback', e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500"
                            rows={5}
                            placeholder="Please provide a clear reason for rejection..."
                            required
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button 
                                type="button" 
                                onClick={() => { setRejectionModalOpen(false); setDetailsModalOpen(true); }} 
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : 'Proceed'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {/* Success Modal */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg max-w-sm w-full shadow-xl text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">SUCCESS!</h2>
                        <p className="text-gray-600 mb-6">Your action has been successfully completed.</p>
                        <button 
                            onClick={handleSuccessContinue}
                            className="w-full px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
};

export default AdminRequestOverview;
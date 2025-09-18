import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';

// --- Type Definitions ---
interface Facility {
    id: number;
    name: string;
}

interface BookingRequest {
    id: number;
    event_name: string;
    facility_id: number;
    purpose: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    feedback: string | null;
    facility: Facility;
}

interface PageProps {
    request: BookingRequest;
    facilities: Facility[];
}

// --- Reusable Success Modal Component ---
const SuccessModal = ({ message, onClose }: { message: string, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-8 rounded-lg max-w-sm w-full shadow-xl text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">SUCCESS!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
                onClick={onClose}
                className="w-full px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                Continue
            </button>
        </div>
    </div>
);


// --- Main Component ---
const ShowBookingRequest = ({ request, facilities }: PageProps) => {
    // --- FIX IS HERE: Changed how flash messages are accessed ---
    const { flash } = usePage().props as any;
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    
    const isEditable = request.status === 'Pending';

    const { data, setData, put, processing, errors } = useForm({
        event_name: request.event_name,
        facility_id: request.facility_id,
        purpose: request.purpose,
    });

    useEffect(() => {
        if (flash?.success) {
            setSuccessModalOpen(true);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isEditable) return;
        put(route('facility-booking.update', request.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditable ? 'Edit Request' : 'View Request'} />

            {isSuccessModalOpen && flash?.success && (
                <SuccessModal message={flash.success} onClose={() => setSuccessModalOpen(false)} />
            )}

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <header className="border-b pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">{isEditable ? 'Edit Request' : 'View Request Details'}</h1>
                    <p className="text-gray-500 mt-1">Status: <span className="font-semibold">{request.status}</span></p>
                </header>

                {request.status === 'Rejected' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
                        <h3 className="font-bold">Admin Feedback:</h3>
                        <p className="mt-1">{request.feedback || 'No feedback provided.'}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="event_name" className="block text-sm font-medium text-gray-700">Event Name</label>
                        <input 
                            id="event_name"
                            type="text"
                            value={data.event_name}
                            onChange={e => setData('event_name', e.target.value)}
                            disabled={!isEditable}
                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                         {errors.event_name && <p className="text-sm text-red-600 mt-1">{errors.event_name}</p>}
                    </div>
                    <div>
                        <label htmlFor="facility_id" className="block text-sm font-medium text-gray-700">Facility</label>
                        <select
                            id="facility_id"
                            value={data.facility_id}
                            onChange={e => setData('facility_id', parseInt(e.target.value))}
                            disabled={!isEditable}
                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            {facilities.map(facility => (
                                <option key={facility.id} value={facility.id}>{facility.name}</option>
                            ))}
                        </select>
                        {errors.facility_id && <p className="text-sm text-red-600 mt-1">{errors.facility_id}</p>}
                    </div>
                    <div>
                        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Purpose</label>
                         <textarea
                            id="purpose"
                            value={data.purpose}
                            onChange={e => setData('purpose', e.target.value)}
                            disabled={!isEditable}
                            rows={5}
                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                         {errors.purpose && <p className="text-sm text-red-600 mt-1">{errors.purpose}</p>}
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4 border-t">
                         <Link href={route('facility-booking.overview')} className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                           Back to Overview
                        </Link>
                        {isEditable && (
                            <button type="submit" disabled={processing} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default ShowBookingRequest;
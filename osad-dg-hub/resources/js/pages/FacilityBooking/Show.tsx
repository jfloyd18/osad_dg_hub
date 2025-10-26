import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { Upload, X, CheckCircle, FileText, Download } from 'lucide-react';

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
    department: string;
    organization: string;
    contact_no: string;
    person_responsible: string;
    estimated_people: number;
    event_start_date: string;
    event_start_time: string;
    event_end_time: string;
    moderator: string;
    activity_plan_path?: string;
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
    const { flash } = usePage().props as any;
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState<string>('');
    
    const isEditable = request.status === 'Pending';

    const { data, setData, put, processing, errors } = useForm({
        event_name: request.event_name,
        facility_id: request.facility_id,
        purpose: request.purpose,
        department: request.department,
        organization: request.organization,
        contact_no: request.contact_no,
        person_responsible: request.person_responsible,
        estimated_people: request.estimated_people,
        event_start_date: request.event_start_date,
        event_start_time: request.event_start_time,
        event_end_time: request.event_end_time,
        moderator: request.moderator,
        activity_plan: null as File | null,
    });

    useEffect(() => {
        if (flash?.success) {
            setSuccessModalOpen(true);
        }
    }, [flash]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file only');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('File size should not exceed 5MB');
                return;
            }
            setData('activity_plan', file);
            setUploadedFileName(file.name);
        }
    };

    const removeFile = () => {
        setData('activity_plan', null);
        setUploadedFileName('');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isEditable) return;
        put(route('facility-booking.update', request.id));
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Approved': 'bg-green-100 text-green-800 border-green-300',
            'Rejected': 'bg-red-100 text-red-800 border-red-300',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${colors[status as keyof typeof colors]}`}>
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditable ? 'Edit Request' : 'View Request'} />

            {isSuccessModalOpen && flash?.success && (
                <SuccessModal message={flash.success} onClose={() => setSuccessModalOpen(false)} />
            )}

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                {/* Header */}
                <header className="text-center border-b pb-6 mb-6">
                    <div className="flex items-center justify-center mb-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {isEditable ? 'Edit Facility Booking Request' : 'Facility Booking Request Details'}
                            </h1>
                            <p className="text-sm text-gray-600">OFFICE OF THE STUDENT AFFAIRS AND DISCIPLINE</p>
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-3 mt-4">
                        <span className="text-sm font-medium text-gray-600">Status:</span>
                        {getStatusBadge(request.status)}
                    </div>
                </header>

                {request.status === 'Rejected' && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-md">
                        <h3 className="font-bold text-lg mb-2">Admin Feedback:</h3>
                        <p className="text-sm">{request.feedback || 'No feedback provided.'}</p>
                    </div>
                )}

                {request.status === 'Approved' && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-md">
                        <div className="flex items-center">
                            <CheckCircle className="mr-2" size={24} />
                            <h3 className="font-bold text-lg">Request Approved!</h3>
                        </div>
                        <p className="text-sm mt-2">Your facility booking request has been approved by the administrator.</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Requesting Party Section */}
                    <section className="border rounded-lg p-6 bg-gray-50">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase border-b pb-2">Requesting Party</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Department <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    id="department"
                                    type="text"
                                    value={data.department}
                                    onChange={e => setData('department', e.target.value)}
                                    disabled={!isEditable}
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500"
                                />
                                {errors.department && <p className="text-sm text-red-600 mt-1">{errors.department}</p>}
                            </div>

                            <div>
                                <label htmlFor="person_responsible" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Person Responsible <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    id="person_responsible"
                                    type="text"
                                    value={data.person_responsible}
                                    onChange={e => setData('person_responsible', e.target.value)}
                                    disabled={!isEditable}
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500"
                                />
                                {errors.person_responsible && <p className="text-sm text-red-600 mt-1">{errors.person_responsible}</p>}
                            </div>

                            <div>
                                <label htmlFor="organization" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Club/Organization <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    id="organization"
                                    type="text"
                                    value={data.organization}
                                    onChange={e => setData('organization', e.target.value)}
                                    disabled={!isEditable}
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500"
                                />
                                {errors.organization && <p className="text-sm text-red-600 mt-1">{errors.organization}</p>}
                            </div>

                            <div>
                                <label htmlFor="contact_no" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contact No. <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    id="contact_no"
                                    type="tel"
                                    value={data.contact_no}
                                    onChange={e => setData('contact_no', e.target.value)}
                                    disabled={!isEditable}
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500"
                                />
                                {errors.contact_no && <p className="text-sm text-red-600 mt-1">{errors.contact_no}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Event Details Section */}
                    <section className="border rounded-lg p-6 bg-gray-50">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase border-b pb-2">Event Details</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="event_name" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Name of Event <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        id="event_name"
                                        type="text"
                                        value={data.event_name}
                                        onChange={e => setData('event_name', e.target.value)}
                                        disabled={!isEditable}
                                        className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500"
                                    />
                                    {errors.event_name && <p className="text-sm text-red-600 mt-1">{errors.event_name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="event_start_date" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date of Event <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        id="event_start_date"
                                        type="date"
                                        value={data.event_start_date}
                                        onChange={e => setData('event_start_date', e.target.value)}
                                        disabled={!isEditable}
                                        className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500"
                                    />
                                    {errors.event_start_date && <p className="text-sm text-red-600 mt-1">{errors.event_start_date}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="event_start_time" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Time of Event Start <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        id="event_start_time"
                                        type="time"
                                        value={data.event_start_time}
                                        onChange={e => setData('event_start_time', e.target.value)}
                                        disabled={!isEditable}
                                        className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500"
                                    />
                                    {errors.event_start_time && <p className="text-sm text-red-600 mt-1">{errors.event_start_time}</p>}
                                </div>

                                <div>
                                    <label htmlFor="event_end_time" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Time of Event End <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        id="event_end_time"
                                        type="time"
                                        value={data.event_end_time}
                                        onChange={e => setData('event_end_time', e.target.value)}
                                        disabled={!isEditable}
                                        className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500"
                                    />
                                    {errors.event_end_time && <p className="text-sm text-red-600 mt-1">{errors.event_end_time}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="estimated_people" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Estimated Attendance <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    id="estimated_people"
                                    type="number"
                                    value={data.estimated_people}
                                    onChange={e => setData('estimated_people', parseInt(e.target.value, 10))}
                                    disabled={!isEditable}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500"
                                />
                                {errors.estimated_people && <p className="text-sm text-red-600 mt-1">{errors.estimated_people}</p>}
                            </div>

                            <div>
                                <label htmlFor="facility_id" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Facilities Required <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="facility_id"
                                    value={data.facility_id}
                                    onChange={e => setData('facility_id', parseInt(e.target.value))}
                                    disabled={!isEditable}
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500"
                                >
                                    {facilities.map(facility => (
                                        <option key={facility.id} value={facility.id}>{facility.name}</option>
                                    ))}
                                </select>
                                {errors.facility_id && <p className="text-sm text-red-600 mt-1">{errors.facility_id}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Purpose Section */}
                    <section className="border rounded-lg p-6 bg-gray-50">
                        <label htmlFor="purpose" className="block text-lg font-bold text-gray-800 mb-2 uppercase">
                            Purpose <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="purpose"
                            value={data.purpose}
                            onChange={e => setData('purpose', e.target.value)}
                            disabled={!isEditable}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500"
                        />
                        {errors.purpose && <p className="text-sm text-red-600 mt-1">{errors.purpose}</p>}
                    </section>

                    {/* Activity Plan Section */}
                    <section className="border rounded-lg p-6 bg-gray-50">
                        <label className="block text-lg font-bold text-gray-800 mb-2 uppercase">
                            Activity Plan (PDF)
                        </label>
                        
                        {request.activity_plan_path && !isEditable ? (
                            <div className="flex items-center p-4 bg-white border border-gray-300 rounded-lg">
                                <FileText className="text-red-600 mr-3" size={32} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">Activity Plan Document</p>
                                    <p className="text-xs text-gray-500">PDF File</p>
                                </div>
                                <a 
                                    href={request.activity_plan_path} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    <Download size={16} className="mr-2" />
                                    Download
                                </a>
                            </div>
                        ) : isEditable ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                {!uploadedFileName ? (
                                    <label htmlFor="activity-plan" className="cursor-pointer">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600 mb-1">
                                            {request.activity_plan_path ? 'Upload new file to replace existing' : 'Click to upload or drag and drop'}
                                        </p>
                                        <p className="text-xs text-gray-500">PDF only (Max 5MB)</p>
                                        <input 
                                            type="file" 
                                            id="activity-plan"
                                            accept="application/pdf"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </label>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <CheckCircle className="text-green-600 mr-2" size={20} />
                                        <span className="text-sm font-medium text-gray-700">{uploadedFileName}</span>
                                        <button 
                                            type="button"
                                            onClick={removeFile}
                                            className="ml-3 text-red-600 hover:text-red-800"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No activity plan uploaded</p>
                        )}
                    </section>

                    {/* Adviser/Moderator Section */}
                    <section className="border rounded-lg p-6 bg-gray-50">
                        <label htmlFor="moderator" className="block text-lg font-bold text-gray-800 mb-2 uppercase">
                            Adviser/Moderator <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="moderator" 
                            value={data.moderator} 
                            onChange={(e) => setData('moderator', e.target.value)} 
                            disabled={!isEditable}
                            className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500"
                        />
                        {errors.moderator && <p className="text-sm text-red-600 mt-1">{errors.moderator}</p>}
                        {!isEditable && (
                            <p className="text-xs text-gray-500 mt-2 italic">Digital signature on record</p>
                        )}
                    </section>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t">
                        <Link 
                            href={route('facility-booking.overview')} 
                            className="px-6 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 font-medium"
                        >
                            ← Back to Overview
                        </Link>
                        {isEditable && (
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="px-8 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                            >
                                {processing ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default ShowBookingRequest;
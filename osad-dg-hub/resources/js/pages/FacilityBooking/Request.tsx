import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import apiClient from '../../lib/api';
import { AlertCircle, CheckCircle, Loader, XCircle } from 'lucide-react';

// --- Type Definitions ---
interface Facility {
    id: number;
    name: string;
    capacity: number;
}

interface Organization {
    id: number;
    name: string;
}

interface AvailabilityInfo {
    facility_id: number;
    facility_name: string;
    capacity: number;
    is_available: boolean;
    conflicting_bookings?: {
        event_name: string;
        start_time: string;
        end_time: string;
        organization: string;
    }[] | null;
}

interface AvailabilityResponse {
    availability: Record<number, AvailabilityInfo>;
    requested_time: {
        start: string;
        end: string;
    };
}

// --- MAIN COMPONENT ---
const RequestFacilityPage = () => {
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        department: '',
        organization: '',
        contact_no: '',
        event_name: '',
        facility_id: '',
        estimated_people: 40,
        event_start_date: '',
        event_start_time: '',
        event_end_date: '',
        event_end_time: '',
        purpose: '',
    });

    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [availabilityStatus, setAvailabilityStatus] = useState<Record<number, AvailabilityInfo>>({});
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [selectedFacilityInfo, setSelectedFacilityInfo] = useState<AvailabilityInfo | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];
    const currentTimeString = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

    // Fetch facilities and organizations
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [facilitiesRes, organizationsRes] = await Promise.all([
                    apiClient.get('/api/facilities'),
                    apiClient.get('/api/organizations')
                ]);
                setFacilities(facilitiesRes.data);
                setOrganizations(organizationsRes.data);
            } catch (err) {
                setFetchError('Could not load booking options. Please try again later.');
                console.error("Data fetch error:", err);
            }
        };
        fetchData();
    }, []);

    // Check availability when date/time changes
    useEffect(() => {
        if (data.event_start_date && data.event_start_time && 
            data.event_end_date && data.event_end_time) {
            checkAllFacilitiesAvailability();
        } else {
            setAvailabilityStatus({});
            setSelectedFacilityInfo(null);
        }
    }, [data.event_start_date, data.event_start_time, data.event_end_date, data.event_end_time]);

    // Update selected facility info when facility_id changes
    useEffect(() => {
        if (data.facility_id && availabilityStatus[parseInt(data.facility_id)]) {
            setSelectedFacilityInfo(availabilityStatus[parseInt(data.facility_id)]);
        } else {
            setSelectedFacilityInfo(null);
        }
    }, [data.facility_id, availabilityStatus]);

    const checkAllFacilitiesAvailability = async () => {
        setCheckingAvailability(true);
        
        try {
            const response = await apiClient.post<AvailabilityResponse>('/api/facilities/check-availability', {
                event_start_date: data.event_start_date,
                event_start_time: data.event_start_time,
                event_end_date: data.event_end_date,
                event_end_time: data.event_end_time,
            });
            
            setAvailabilityStatus(response.data.availability);
        } catch (err) {
            console.error("Availability check error:", err);
            setAvailabilityStatus({});
        } finally {
            setCheckingAvailability(false);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // Additional validation: check if selected facility is available
        if (data.facility_id && selectedFacilityInfo && !selectedFacilityInfo.is_available) {
            alert('The selected facility is not available for the chosen time slot. Please select a different facility or time.');
            return;
        }
        
        post(route('facility-booking.request.store'), {
            onSuccess: () => {
                reset();
                setAvailabilityStatus({});
                setSelectedFacilityInfo(null);
            },
        });
    };
    
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setData(currentData => {
            if (newStartDate > currentData.event_end_date) {
                return {
                    ...currentData,
                    event_start_date: newStartDate,
                    event_end_date: '',
                    event_end_time: '',
                };
            }
            return { ...currentData, event_start_date: newStartDate };
        });
    };

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartTime = e.target.value;
        setData(currentData => {
            if (currentData.event_start_date === currentData.event_end_date && newStartTime >= currentData.event_end_time) {
                return { ...currentData, event_start_time: newStartTime, event_end_time: '' };
            }
            return { ...currentData, event_start_time: newStartTime };
        });
    };

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    // Get facility availability badge
    const getFacilityAvailabilityBadge = (facilityId: number) => {
        if (checkingAvailability) {
            return <Loader className="inline ml-2 animate-spin" size={16} />;
        }
        
        const info = availabilityStatus[facilityId];
        if (!info) return null;
        
        if (info.is_available) {
            return (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" /> Available
                </span>
            );
        } else {
            return (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    <XCircle size={12} className="mr-1" /> Unavailable
                </span>
            );
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Request Facility" />
            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                <header>
                    <h1 className="text-3xl font-bold text-gray-800">Request Facility</h1>
                    <p className="text-gray-500 mt-1">Set a schedule for a place for the event</p>
                </header>

                {recentlySuccessful && (
                     <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md flex items-start">
                         <CheckCircle className="mr-2 flex-shrink-0 mt-0.5" size={20} />
                         <div>
                             <strong>Success:</strong> Your request has been submitted successfully!
                         </div>
                     </div>
                )}
                {Object.keys(errors).length > 0 && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md flex items-start">
                        <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <strong>Error:</strong> {Object.values(errors)[0]}
                        </div>
                    </div>
                )}
                {fetchError && (
                    <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-md flex items-start">
                        <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={20} />
                        <div>{fetchError}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-10">
                    {/* Requesting Party Section */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-700">Requesting Party</h2>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                    Department <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    id="department" 
                                    value={data.department} 
                                    onChange={(e) => setData('department', e.target.value)} 
                                    required 
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select Department</option>
                                    <option value="College of Computer Studies">College of Computer Studies</option>
                                    <option value="College of Engineering and Architecture">College of Engineering and Architecture</option>
                                    <option value="College of Business Education">College of Business Education</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                                    Club/Organization <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    id="organization" 
                                    value={data.organization} 
                                    onChange={(e) => setData('organization', e.target.value)} 
                                    required 
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select Organization</option>
                                    {organizations.map(org => (
                                        <option key={org.id} value={org.name}>{org.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="contact-no" className="block text-sm font-medium text-gray-700">
                                    Contact No. <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="tel" 
                                    id="contact-no" 
                                    value={data.contact_no} 
                                    onChange={(e) => setData('contact_no', e.target.value)} 
                                    required 
                                    placeholder="ex. 09123456789" 
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                                />
                            </div>
                        </div>
                    </section>

                    {/* Event Details Section */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-700">Event Details</h2>
                        <div className="mt-4 space-y-6">
                            {/* Event Name and Estimated People */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="event-name" className="block text-sm font-medium text-gray-700">
                                        Event Name <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id="event-name" 
                                        value={data.event_name} 
                                        onChange={(e) => setData('event_name', e.target.value)} 
                                        required 
                                        placeholder="ex. Nihongo Makeup Class" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="estimated-people" className="block text-sm font-medium text-gray-700">
                                        Estimated People <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        id="estimated-people" 
                                        value={data.estimated_people} 
                                        onChange={(e) => setData('estimated_people', parseInt(e.target.value, 10))} 
                                        required 
                                        min="1" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                                    />
                                </div>
                            </div>

                            {/* Date and Time Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Start <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="date" 
                                            value={data.event_start_date} 
                                            onChange={handleStartDateChange} 
                                            required 
                                            min={todayDateString} 
                                            className="w-full pl-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" 
                                        />
                                        <input 
                                            type="time" 
                                            value={data.event_start_time} 
                                            onChange={handleStartTimeChange} 
                                            required 
                                            min={data.event_start_date === todayDateString ? currentTimeString : undefined} 
                                            className="w-full pl-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event End <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="date" 
                                            value={data.event_end_date} 
                                            onChange={(e) => setData('event_end_date', e.target.value)} 
                                            required 
                                            min={data.event_start_date} 
                                            className="w-full pl-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" 
                                            disabled={!data.event_start_date} 
                                        />
                                        <input 
                                            type="time" 
                                            value={data.event_end_time} 
                                            onChange={(e) => setData('event_end_time', e.target.value)} 
                                            required 
                                            min={data.event_start_date === data.event_end_date ? data.event_start_time : undefined} 
                                            className="w-full pl-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" 
                                            disabled={!data.event_start_time || !data.event_end_date} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Facility Selection with Availability */}
                            <div>
                                <label htmlFor="facility-required" className="block text-sm font-medium text-gray-700">
                                    Facility Required <span className="text-red-500">*</span>
                                    {checkingAvailability && (
                                        <span className="ml-2 text-xs text-gray-500">
                                            <Loader className="inline animate-spin mr-1" size={14} />
                                            Checking availability...
                                        </span>
                                    )}
                                </label>
                                <select 
                                    id="facility-required" 
                                    value={data.facility_id} 
                                    onChange={(e) => setData('facility_id', e.target.value)} 
                                    required 
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                                    disabled={!data.event_start_date || !data.event_start_time || !data.event_end_date || !data.event_end_time}
                                >
                                    <option value="">
                                        {!data.event_start_date || !data.event_start_time || !data.event_end_date || !data.event_end_time
                                            ? 'Select date and time first'
                                            : 'Select Facility'}
                                    </option>
                                    {facilities.map(f => {
                                        const avail = availabilityStatus[f.id];
                                        const isAvailable = avail ? avail.is_available : true;
                                        return (
                                            <option 
                                                key={f.id} 
                                                value={f.id}
                                                disabled={!isAvailable}
                                            >
                                                {f.name} (Capacity: {f.capacity})
                                                {avail && !isAvailable ? ' - UNAVAILABLE' : ''}
                                                {avail && isAvailable ? ' - Available' : ''}
                                            </option>
                                        );
                                    })}
                                </select>

                                {/* Availability Info for Selected Facility */}
                                {selectedFacilityInfo && (
                                    <div className="mt-3">
                                        {selectedFacilityInfo.is_available ? (
                                            <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
                                                <CheckCircle className="text-green-600 mr-2 flex-shrink-0 mt-0.5" size={20} />
                                                <div>
                                                    <p className="text-sm font-medium text-green-800">
                                                        {selectedFacilityInfo.facility_name} is available
                                                    </p>
                                                    <p className="text-xs text-green-600 mt-1">
                                                        This facility is free for your selected time slot.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                                <div className="flex items-start mb-2">
                                                    <XCircle className="text-red-600 mr-2 flex-shrink-0 mt-0.5" size={20} />
                                                    <div>
                                                        <p className="text-sm font-medium text-red-800">
                                                            {selectedFacilityInfo.facility_name} is not available
                                                        </p>
                                                        <p className="text-xs text-red-600 mt-1">
                                                            There are conflicting bookings during your selected time.
                                                        </p>
                                                    </div>
                                                </div>
                                                {selectedFacilityInfo.conflicting_bookings && selectedFacilityInfo.conflicting_bookings.length > 0 && (
                                                    <div className="mt-3 pl-7">
                                                        <p className="text-xs font-semibold text-red-700 mb-2">Conflicting Bookings:</p>
                                                        {selectedFacilityInfo.conflicting_bookings.map((booking, idx) => (
                                                            <div key={idx} className="text-xs text-red-700 mb-2 p-2 bg-red-100 rounded">
                                                                <p className="font-semibold">{booking.event_name}</p>
                                                                <p>{booking.organization}</p>
                                                                <p className="text-red-600">
                                                                    {formatDateTime(booking.start_time)} - {formatDateTime(booking.end_time)}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Purpose Section */}
                    <section>
                        <label htmlFor="purpose" className="block text-xl font-semibold text-gray-700">
                            Purpose <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            id="purpose" 
                            value={data.purpose} 
                            onChange={(e) => setData('purpose', e.target.value)} 
                            required 
                            rows={5} 
                            placeholder="Please describe the purpose of your event..." 
                            className="mt-4 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        ></textarea>
                    </section>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={processing || (selectedFacilityInfo && !selectedFacilityInfo.is_available)} 
                            className={`font-bold py-2 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                processing || (selectedFacilityInfo && !selectedFacilityInfo.is_available)
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                        >
                            {processing ? (
                                <span className="flex items-center">
                                    <Loader className="animate-spin mr-2" size={16} />
                                    Submitting...
                                </span>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default RequestFacilityPage;
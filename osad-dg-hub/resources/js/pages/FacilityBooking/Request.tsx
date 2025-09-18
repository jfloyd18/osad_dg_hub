import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import apiClient from '../../lib/api';

// Define the shape of a Facility object
interface Facility {
    id: number;
    name: string;
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
    const [fetchError, setFetchError] = useState<string | null>(null);

    // --- LOGIC FOR DATE/TIME CONSTRAINTS ---
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];
    const currentTimeString = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
    
    useEffect(() => {
        apiClient.get('/api/facilities')
            .then(response => setFacilities(response.data))
            .catch(err => {
                setFetchError('Could not load facility options.');
                console.error("Facility fetch error:", err);
            });
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // NOTE: Make sure you have a 'facility-booking.request.store' route in your web.php
        post(route('facility-booking.request.store'), {
            onSuccess: () => reset(),
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
            if (currentData.event_start_date === currentData.event_end_date && newStartTime > currentData.event_end_time) {
                return { ...currentData, event_start_time: newStartTime, event_end_time: '' };
            }
            return { ...currentData, event_start_time: newStartTime };
        });
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
                     <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                         <strong>Success:</strong> Your request has been submitted successfully!
                     </div>
                )}
                {/* --- FIX IS HERE: Changed how the first error is accessed --- */}
                {Object.keys(errors).length > 0 && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                        <strong>Error:</strong> {Object.values(errors)[0]}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-10">
                    {/* Requesting Party Section */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-700">Requesting Party</h2>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department <span className="text-red-500">*</span></label>
                                <select id="department" value={data.department} onChange={(e) => setData('department', e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                                    <option value="">Select Department</option>
                                    <option value="College of Computer Studies">College of Computer Studies</option>
                                    <option value="College of Engineering and Architecture">College of Engineering and Architecture</option>
                                    <option value="College of Business Education">College of Business Education</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Club/Organization <span className="text-red-500">*</span></label>
                                <input type="text" id="organization" value={data.organization} onChange={(e) => setData('organization', e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="contact-no" className="block text-sm font-medium text-gray-700">Contact No. <span className="text-red-500">*</span></label>
                                <input type="tel" id="contact-no" value={data.contact_no} onChange={(e) => setData('contact_no', e.target.value)} required placeholder="ex. 09123456789" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                        </div>
                    </section>

                    {/* Event Details Section */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-700">Event Details</h2>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <label htmlFor="event-name" className="block text-sm font-medium text-gray-700">Event Name <span className="text-red-500">*</span></label>
                                <input type="text" id="event-name" value={data.event_name} onChange={(e) => setData('event_name', e.target.value)} required placeholder="ex. Nihongo Makeup Class" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="facility-required" className="block text-sm font-medium text-gray-700">Facility Required <span className="text-red-500">*</span></label>
                                <select id="facility-required" value={data.facility_id} onChange={(e) => setData('facility_id', e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                                    <option value="">Select Facility</option>
                                    {facilities.map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="estimated-people" className="block text-sm font-medium text-gray-700">Estimated People <span className="text-red-500">*</span></label>
                                <input type="number" id="estimated-people" value={data.estimated_people} onChange={(e) => setData('estimated_people', parseInt(e.target.value, 10))} required min="1" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>

                            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Event Start <span className="text-red-500">*</span></label>
                                    <div className="mt-1 flex gap-2">
                                        <input type="date" value={data.event_start_date} onChange={handleStartDateChange} required min={todayDateString} className="w-full pl-3 py-2 border border-gray-300 rounded-md" />
                                        <input type="time" value={data.event_start_time} onChange={handleStartTimeChange} required min={data.event_start_date === todayDateString ? currentTimeString : undefined} className="w-full pl-3 py-2 border border-gray-300 rounded-md" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Event End <span className="text-red-500">*</span></label>
                                    <div className="mt-1 flex gap-2">
                                        <input type="date" value={data.event_end_date} onChange={(e) => setData('event_end_date', e.target.value)} required min={data.event_start_date} className="w-full pl-3 py-2 border border-gray-300 rounded-md" disabled={!data.event_start_date} />
                                        <input type="time" value={data.event_end_time} onChange={(e) => setData('event_end_time', e.target.value)} required min={data.event_start_date === data.event_end_date ? data.event_start_time : undefined} className="w-full pl-3 py-2 border border-gray-300 rounded-md" disabled={!data.event_start_time || !data.event_end_date} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <label htmlFor="purpose" className="block text-xl font-semibold text-gray-700">Purpose <span className="text-red-500">*</span></label>
                        <textarea id="purpose" value={data.purpose} onChange={(e) => setData('purpose', e.target.value)} required rows={5} placeholder="Please describe the purpose of your event..." className="mt-4 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
                    </section>

                    <div className="flex justify-end">
                        <button type="submit" disabled={processing} className={`font-bold py-2 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                            {processing ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default RequestFacilityPage;
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import apiClient from '../../lib/api';

const Icon = ({ path, className = 'w-5 h-5' }: { path: string; className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

const RequestFacilityPage = () => {
    const [department, setDepartment] = useState('');
    const [organization, setOrganization] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [eventName, setEventName] = useState('');
    const [facility, setFacility] = useState<number | ''>('');
    const [estimatedPeople, setEstimatedPeople] = useState(40);
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [purpose, setPurpose] = useState('');

    const [facilities, setFacilities] = useState<{ id: number; name: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await apiClient.get('/api/facilities');
                console.log('API Response Data:', response.data);
                setFacilities(response.data);
            } catch (err) {
                setError('Could not load facility options. Please check the backend connection.');
                console.error("Facility fetch error:", err);
            }
        };
        fetchFacilities();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        // Basic validation
        if (!facility) {
            setError('Please select a facility');
            setIsSubmitting(false);
            return;
        }

        // Validate dates
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);
        
        if (endDateTime <= startDateTime) {
            setError('Event end time must be after start time');
            setIsSubmitting(false);
            return;
        }

        const formData = {
            department,
            organization,
            contact_no: contactNo,
            event_name: eventName,
            facility_id: facility,
            estimated_people: estimatedPeople,
            event_start_date: startDate,
            event_start_time: startTime,
            event_end_date: endDate,
            event_end_time: endTime,
            purpose,
        };

        try {
            const response = await apiClient.post('/api/requests', formData);
            setSuccess('Your request has been submitted successfully!');
            
            // Reset form fields
            setDepartment('');
            setOrganization('');
            setContactNo('');
            setEventName('');
            setFacility('');
            setEstimatedPeople(40);
            setStartDate('');
            setStartTime('');
            setEndDate('');
            setEndTime('');
            setPurpose('');
        } catch (err: any) {
            if (err.response?.data?.errors) {
                // Handle validation errors
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(', ');
                setError(`Validation failed: ${errorMessages}`);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to submit request. Please check your input and try again.');
            }
            console.error('Submission error:', err.response?.data);
        } finally {
            setIsSubmitting(false);
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

                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                        <strong>Error:</strong> {error}
                    </div>
                )}
                {success && (
                    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                        <strong>Success:</strong> {success}
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
                                    value={department} 
                                    onChange={(e) => setDepartment(e.target.value)} 
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
                                <input 
                                    type="text" 
                                    id="organization" 
                                    value={organization} 
                                    onChange={(e) => setOrganization(e.target.value)} 
                                    required
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label htmlFor="contact-no" className="block text-sm font-medium text-gray-700">
                                    Contact No. <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="tel" 
                                    id="contact-no" 
                                    value={contactNo} 
                                    onChange={(e) => setContactNo(e.target.value)} 
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
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <label htmlFor="event-name" className="block text-sm font-medium text-gray-700">
                                    Event Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="event-name" 
                                    value={eventName} 
                                    onChange={(e) => setEventName(e.target.value)} 
                                    required 
                                    placeholder="ex. Nihongo Makeup Class" 
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label htmlFor="facility-required" className="block text-sm font-medium text-gray-700">
                                    Facility Required <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    id="facility-required" 
                                    value={facility} 
                                    onChange={(e) => setFacility(e.target.value === '' ? '' : parseInt(e.target.value))} 
                                    required 
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select Facility</option>
                                    {facilities.map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="estimated-people" className="block text-sm font-medium text-gray-700">
                                    Estimated People <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    id="estimated-people" 
                                    value={estimatedPeople} 
                                    onChange={(e) => setEstimatedPeople(parseInt(e.target.value, 10) || 1)} 
                                    required 
                                    min="1"
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Event Start <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1 flex gap-2">
                                        <input 
                                            type="date" 
                                            value={startDate} 
                                            onChange={(e) => setStartDate(e.target.value)} 
                                            required 
                                            className="w-full pl-3 py-2 border border-gray-300 rounded-md"
                                        />
                                        <input 
                                            type="time" 
                                            value={startTime} 
                                            onChange={(e) => setStartTime(e.target.value)} 
                                            required 
                                            className="w-full pl-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Event End <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1 flex gap-2">
                                        <input 
                                            type="date" 
                                            value={endDate} 
                                            onChange={(e) => setEndDate(e.target.value)} 
                                            required 
                                            className="w-full pl-3 py-2 border border-gray-300 rounded-md"
                                        />
                                        <input 
                                            type="time" 
                                            value={endTime} 
                                            onChange={(e) => setEndTime(e.target.value)} 
                                            required 
                                            className="w-full pl-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <label htmlFor="purpose" className="block text-xl font-semibold text-gray-700">
                            Purpose <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            id="purpose" 
                            value={purpose} 
                            onChange={(e) => setPurpose(e.target.value)} 
                            required 
                            rows={5} 
                            placeholder="Please describe the purpose of your event..."
                            className="mt-4 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        ></textarea>
                    </section>

                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`font-bold py-2 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                isSubmitting 
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                    : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default RequestFacilityPage;
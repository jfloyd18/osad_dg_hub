// In: resources/js/pages/FacilityBooking/Request.tsx

import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout'; // <-- Use the real layout
import { Head } from '@inertiajs/react'; // <-- Use the real Head component
import apiClient from '../../lib/api'; 

// --- The mock components are now REMOVED ---

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
  const [facility, setFacility] = useState('');
  const [estimatedPeople, setEstimatedPeople] = useState(40);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  const [facilities, setFacilities] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await apiClient.get('/api/facilities');
        
        // --- ADD THIS LINE FOR DEBUGGING ---
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

    const formData = {
      department,
      organization,
      contact_no: contactNo,
      event_name: eventName,
      facility_name: facility,
      estimated_people: estimatedPeople,
      event_start: `${startDate}T${startTime}`,
      event_end: `${endDate}T${endTime}`,
      purpose,
    };

    try {
      await apiClient.post('/api/requests', formData);
      setSuccess('Your request has been submitted successfully!');
      // Optionally reset form fields here
    } catch (err: any) {
      setError('Failed to submit request. Please check your input and try again.');
      console.error('Submission error:', err.response?.data);
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

        {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
        {success && <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-10">
            {/* Requesting Party Section */}
            <section>
                <h2 className="text-xl font-semibold text-gray-700">Requesting Party</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                        <select id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                            <option value="">Select Department</option>
                            <option value="ccs">College of Computer Studies</option>
                            <option value="cea">College of Engineering and Architecture</option>
                            <option value="cbe">College of Business Education</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Club/Organization</label>
                        <input type="text" id="organization" value={organization} onChange={(e) => setOrganization(e.target.value)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="contact-no" className="block text-sm font-medium text-gray-700">Contact No.</label>
                        <input type="tel" id="contact-no" value={contactNo} onChange={(e) => setContactNo(e.target.value)} required placeholder="ex. 09123456789" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                    </div>
                </div>
            </section>

            {/* Event Details Section */}
            <section>
                <h2 className="text-xl font-semibold text-gray-700">Event Details</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <label htmlFor="event-name" className="block text-sm font-medium text-gray-700">Event Name</label>
                        <input type="text" id="event-name" value={eventName} onChange={(e) => setEventName(e.target.value)} required placeholder="ex. Nihongo Makeup Class" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="facility-required" className="block text-sm font-medium text-gray-700">Facility Required</label>
                        <select id="facility-required" value={facility} onChange={(e) => setFacility(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                            <option value="">Select Facility</option>
                            {facilities.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="estimated-people" className="block text-sm font-medium text-gray-700">Estimated People</label>
                        <input type="number" id="estimated-people" value={estimatedPeople} onChange={(e) => setEstimatedPeople(parseInt(e.target.value, 10))} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                    </div>

                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Event Start</label>
                            <div className="mt-1 flex gap-2">
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full pl-3 py-2 border border-gray-300 rounded-md"/>
                                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full pl-3 py-2 border border-gray-300 rounded-md"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Event End</label>
                            <div className="mt-1 flex gap-2">
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="w-full pl-3 py-2 border border-gray-300 rounded-md"/>
                                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="w-full pl-3 py-2 border border-gray-300 rounded-md"/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <label htmlFor="purpose" className="block text-xl font-semibold text-gray-700">Purpose</label>
                <textarea id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} required rows={5} className="mt-4 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
            </section>

            <div className="flex justify-end">
                <button type="submit" className="bg-red-600 text-white font-bold py-2 px-8 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Submit
                </button>
            </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
};

export default RequestFacilityPage;
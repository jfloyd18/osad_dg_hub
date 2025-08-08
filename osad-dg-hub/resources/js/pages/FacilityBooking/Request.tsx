import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout'; // Import the layout
import { Head } from '@inertiajs/react'; // Import Head for title

// A simple icon component to display SVG icons like the calendar and clock.
const Icon = ({ path, className = 'w-5 h-5' }: { path: string; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

// Main component for the Request Facility Page
const RequestFacilityPage = () => {
  // State management for all form fields
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = {
      department,
      organization,
      contactNo,
      eventName,
      facility,
      estimatedPeople,
      eventStart: `${startDate}T${startTime}`,
      eventEnd: `${endDate}T${endTime}`,
      purpose,
    };
    console.log('Form Submitted:', formData);
    // Here you would typically send the data to your backend API
    alert('Form submitted! Check the console for the data.');
  };

  return (
    // Wrap the entire page content with the AuthenticatedLayout
    <AuthenticatedLayout>
      <Head title="Request Facility" />

      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        
        {/* Page Header */}
        <header>
          <h1 className="text-3xl font-bold text-gray-800">Request Facility</h1>
          <p className="text-gray-500 mt-1">Set a schedule for a place for the event</p>
        </header>

        <form onSubmit={handleSubmit} className="mt-8 space-y-10">
          
          {/* Section: Requesting Party */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700">Requesting Party</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <select id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                  <option value="">Select Department</option>
                  <option value="ccs">College of Computer Studies</option>
                  <option value="cea">College of Engineering and Architecture</option>
                  <option value="cbe">College of Business Education</option>
                </select>
              </div>
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Club/Organization</label>
                <select id="organization" value={organization} onChange={(e) => setOrganization(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                  <option value="">Select Club/Organization</option>
                  <option value="drama-club">Drama Club</option>
                  <option value="code-geeks">Code Geeks</option>
                  <option value="art-society">Art Society</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-no" className="block text-sm font-medium text-gray-700">Contact No.</label>
                <input type="tel" id="contact-no" value={contactNo} onChange={(e) => setContactNo(e.target.value)} placeholder="ex. 09125687684" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
              </div>
            </div>
          </section>

          {/* Section: Event Details */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700">Event Details</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                  <label htmlFor="event-name" className="block text-sm font-medium text-gray-700">Event Name</label>
                  <input type="text" id="event-name" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="ex. Nihongo Makeup Class" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
              </div>
              <div>
                  <label htmlFor="facility-required" className="block text-sm font-medium text-gray-700">Facility Required</label>
                  <select id="facility-required" value={facility} onChange={(e) => setFacility(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                      <option value="">Select Facility</option>
                      <option value="audi">Auditorium</option>
                      <option value="gym">Gymnasium</option>
                      <option value="conf-room">Conference Room</option>
                  </select>
              </div>
              <div>
                  <label htmlFor="estimated-people" className="block text-sm font-medium text-gray-700">Estimated People</label>
                  <input type="number" id="estimated-people" value={estimatedPeople} onChange={(e) => setEstimatedPeople(parseInt(e.target.value, 10))} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
              </div>

              {/* Event Start and End Timestamps */}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Start</label>
                  <div className="mt-1 flex gap-2">
                    <div className="relative flex-grow">
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"/>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Icon path="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                        </div>
                    </div>
                    <div className="relative">
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"/>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Icon path="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                        </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event End</label>
                   <div className="mt-1 flex gap-2">
                    <div className="relative flex-grow">
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"/>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Icon path="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                        </div>
                    </div>
                    <div className="relative">
                        <input type="time" value={startTime} onChange={(e) => setEndTime(e.target.value)} className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"/>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Icon path="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Purpose */}
          <section>
            <label htmlFor="purpose" className="block text-xl font-semibold text-gray-700">Purpose</label>
            <textarea id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={5} className="mt-4 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
          </section>

          {/* Submit Button */}
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

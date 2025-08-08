// FILE: resources/js/pages/FacilityBooking/Request.tsx

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

export default function Request({ auth }: PageProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Request Facility" />

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Request Facility</h1>
                    <p className="text-gray-500">Set a schedule for a place for the event</p>
                </div>

                <form className="space-y-8">
                    {/* Section: Requesting Party */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Requesting Party</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Department */}
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                                <select id="department" name="department" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500">
                                    <option>Select Department...</option>
                                    {/* Add department options here */}
                                </select>
                            </div>
                            {/* Club/Organization */}
                            <div>
                                <label htmlFor="organization" className="block text-sm font-medium text-gray-600 mb-1">Club/Organization</label>
                                <select id="organization" name="organization" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500">
                                    <option>Select Club/Organization...</option>
                                    {/* Add organization options here */}
                                </select>
                            </div>
                            {/* Contact No. */}
                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-gray-600 mb-1">Contact No.</label>
                                <input type="tel" id="contact" name="contact" placeholder="ex. 09125687684" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" />
                            </div>
                        </div>
                    </div>

                    {/* Section: Event Details */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Event Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Event Name */}
                            <div className="md:col-span-1">
                                <label htmlFor="event_name" className="block text-sm font-medium text-gray-600 mb-1">Event Name</label>
                                <input type="text" id="event_name" name="event_name" placeholder="ex. Nihongo Makeup Class" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" />
                            </div>
                            {/* Facility Required */}
                            <div className="md:col-span-1">
                                <label htmlFor="facility" className="block text-sm font-medium text-gray-600 mb-1">Facility Required</label>
                                <select id="facility" name="facility" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500">
                                    <option>Select Facility...</option>
                                    {/* Add facility options here */}
                                </select>
                            </div>
                            {/* Estimated People */}
                            <div>
                                <label htmlFor="estimated_people" className="block text-sm font-medium text-gray-600 mb-1">Estimated People</label>
                                <input type="number" id="estimated_people" name="estimated_people" placeholder="ex. 40" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                             {/* Event Start Date */}
                             <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-600 mb-1">Event Start</label>
                                <input type="date" id="start_date" name="start_date" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" />
                            </div>
                            {/* Event Start Time */}
                            <div>
                                <label htmlFor="start_time" className="block text-sm font-medium text-gray-600 mb-1">Time Start</label>
                                <input type="time" id="start_time" name="start_time" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" />
                            </div>
                             {/* Event End Date */}
                             <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-600 mb-1">Event End</label>
                                <input type="date" id="end_date" name="end_date" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" />
                            </div>
                            {/* Event End Time */}
                            <div>
                                <label htmlFor="end_time" className="block text-sm font-medium text-gray-600 mb-1">Time End</label>
                                <input type="time" id="end_time" name="end_time" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" />
                            </div>
                        </div>
                    </div>

                    {/* Section: Purpose */}
                    <div>
                        <label htmlFor="purpose" className="block text-lg font-semibold text-gray-700 mb-2">Purpose</label>
                        <textarea id="purpose" name="purpose" rows={6} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button type="submit" className="px-8 py-3 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg transition-colors duration-200">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

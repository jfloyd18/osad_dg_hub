// resources/js/Components/Sidebar.tsx

import React from 'react';
import { Link } from '@inertiajs/react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-red-700 text-white shadow-lg p-6 flex flex-col">
      {/* Top Profile Section */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img src="https://via.placeholder.com/150" alt="Sarah Johnson" className="w-full h-full object-cover" />
        </div>
        <div className="ml-3">
          <div className="text-lg font-semibold">Sarah Johnson</div>
          <div className="text-sm text-red-100">Drama Club Rep</div>
        </div>
      </div>

      <hr className="my-4 border-red-800" />

      {/* Main Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link href={route('dashboard')} className="flex items-center px-4 py-2 text-white hover:bg-white/20 rounded-md transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href={route('calendar')} className="flex items-center px-4 py-2 text-white hover:bg-white/20 rounded-md transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Calendar
            </Link>
          </li>
          <li>
            <Link href={route('facility-booking')} className="flex items-center px-4 py-2 text-white hover:bg-white/20 rounded-md transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Facility Booking
            </Link>
          </li>
          <li>
            <Link href={route('facility-booking.request')} className="flex items-center px-4 py-2 bg-white text-red-700 rounded-md transition-colors duration-200 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H10zm-3 0a1 1 0 100 2h.01a1 1 0 100-2H7zm6 0a1 1 0 100 2h.01a1 1 0 100-2H13z" clipRule="evenodd" />
              </svg>
              Request Facility
            </Link>
          </li>
          <li>
            <Link href={route('request-overview')} className="flex items-center px-4 py-2 text-white hover:bg-white/20 rounded-md transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM6 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm-1 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
              </svg>
              Request Overview
            </Link>
          </li>
          <li>
            <Link href={route('student-concern')} className="flex items-center px-4 py-2 text-white hover:bg-white/20 rounded-md transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Student Concern
            </Link>
          </li>
          <li>
            <Link href={route('organization-management')} className="flex items-center px-4 py-2 text-white hover:bg-white/20 rounded-md transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18H4v-2a4 4 0 014-4h4a4 4 0 014 4v2z" />
              </svg>
              Organization Management
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Link */}
      <div className="mt-auto">
        <Link
          href={route('logout')}
          method="post"
          as="button"
          className="flex items-center w-full px-4 py-2 text-white hover:bg-white/20 rounded-md transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
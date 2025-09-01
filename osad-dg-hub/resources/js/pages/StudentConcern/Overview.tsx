import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// --- Icon Components (can be moved to a shared file) ---
const PlusIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);
const ViewIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);
const EditIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);
const RevertIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
    </svg>
);
const TrendsIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
);
const ChartIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
    </svg>
);


// --- Reusable Components ---
const StatCard = ({ title, value, color }: { title: string, value: number, color: string }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex-1">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: 'Pending' | 'Approved' | 'Revisions' }) => {
    const statusStyles = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Revisions: 'bg-red-100 text-red-800',
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>{status}</span>;
};

// --- Main Page Component ---
const ConcernOverviewPage = () => {
    const [activeTab, setActiveTab] = useState('trends');
    
    // Mock data - replace with data from your backend
    const recentRequests = [
        { id: 1, title: 'Lost Student ID', date: 'Jan 15, 2025', status: 'Pending', feedback: 'Under review by Student Affairs', actions: ['edit', 'view'] },
        { id: 2, title: 'Library Misconduct', date: 'Jan 10, 2025', status: 'Approved', feedback: 'Incident logged and resolved by staff', actions: ['view'] },
        { id: 3, title: 'Disruption During Class Hours', date: 'Jan 5, 2025', status: 'Revisions', feedback: 'Missing teacher\'s account of the incident', actions: ['view', 'revert'] },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Concern Overview" />

            <header>
                <h1 className="text-3xl font-bold text-gray-800">Concern Overview</h1>
                <p className="text-gray-500 mt-1">Review the status and information of each concern.</p>
            </header>

            <section className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Requests" value={24} color="bg-gray-400" />
                <StatCard title="Pending" value={8} color="bg-yellow-400" />
                <StatCard title="Approved" value={12} color="bg-green-400" />
                <StatCard title="Rejected" value={4} color="bg-red-400" />
            </section>

            <section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-lg font-semibold text-gray-700 flex-shrink-0">Recent Requests</h2>
                    <div className="flex items-center gap-2">
                         <Link href={route('student-concern.lodge')} className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 whitespace-nowrap">
                            <PlusIcon />
                            New Request
                        </Link>
                        <button className="px-4 py-2 border bg-gray-600 text-white rounded-md text-sm whitespace-nowrap">View All</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th scope="col" className="px-6 py-3">Incident Title</th>
                                <th scope="col" className="px-6 py-3">Date Submitted</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Feedback</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentRequests.map((request) => (
                                <tr key={request.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{request.title}</td>
                                    <td className="px-6 py-4">{request.date}</td>
                                    <td className="px-6 py-4"><StatusBadge status={request.status as any} /></td>
                                    <td className="px-6 py-4">{request.feedback}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end items-center gap-3">
                                            {request.actions.includes('revert') && <button className="text-gray-500 hover:text-gray-800"><RevertIcon /></button>}
                                            {request.actions.includes('edit') && <button className="text-gray-500 hover:text-gray-800"><EditIcon /></button>}
                                            {request.actions.includes('view') && <button className="text-gray-500 hover:text-gray-800"><ViewIcon /></button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex border-b">
                    <button onClick={() => setActiveTab('trends')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeTab === 'trends' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500'}`}>
                        <TrendsIcon /> Violation Trends
                    </button>
                    <button onClick={() => setActiveTab('distributions')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeTab === 'distributions' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500'}`}>
                        <ChartIcon /> Distributions
                    </button>
                </div>

                {activeTab === 'trends' && (
                    <div className="pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                            <h3 className="text-md font-semibold text-gray-700">Violation trends:</h3>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div>
                                    <label className="text-xs text-gray-500">First school year:</label>
                                    <select className="mt-1 block w-full sm:w-auto border-gray-300 rounded-md shadow-sm text-sm">
                                        <option>2024-2025</option>
                                    </select>
                                </div>
                                 <div>
                                    <label className="text-xs text-gray-500">Second school year:</label>
                                    <select className="mt-1 block w-full sm:w-auto border-gray-300 rounded-md shadow-sm text-sm">
                                        <option>2025-2026</option>
                                    </select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <button className="bg-red-600 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-red-700">Apply</button>
                                    <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-300">Cancel</button>
                                </div>
                            </div>
                        </div>
                        {/* --- Static SVG Chart --- */}
                        <div className="w-full h-[300px] relative">
                            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="xMidYMid meet">
                                {/* Grid lines and Y-Axis labels */}
                                {[0, 20, 40, 60].map((y, i) => (
                                    <g key={y}>
                                        <line x1="30" y1={160 - (y/60*150)} x2="490" y2={160 - (y/60*150)} stroke="#e5e7eb" strokeDasharray="3 3"/>
                                        <text x="25" y={165 - (y/60*150)} textAnchor="end" fontSize="10" fill="#6b7280">{y}</text>
                                    </g>
                                ))}
                                {/* X-Axis labels */}
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, i) => (
                                    <text key={month} x={70 + i * 100} y="180" textAnchor="middle" fontSize="10" fill="#6b7280">{month}</text>
                                ))}
                                
                                {/* Chart Paths */}
                                <path d="M 70 110 C 120 60, 170 80, 270 70 S 370 90, 470 120 L 470 160 L 70 160 Z" fill="rgba(130, 202, 157, 0.4)" stroke="none" />
                                <path d="M 70 110 C 120 60, 170 80, 270 70 S 370 90, 470 120" fill="none" stroke="#82ca9d" strokeWidth="2" />

                                <path d="M 70 130 C 120 80, 170 50, 270 60 S 370 80, 470 100 L 470 160 L 70 160 Z" fill="rgba(136, 132, 216, 0.4)" stroke="none" />
                                <path d="M 70 130 C 120 80, 170 50, 270 60 S 370 80, 470 100" fill="none" stroke="#8884d8" strokeWidth="2" />
                            </svg>
                             {/* Legend */}
                            <div className="absolute top-0 right-0 flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#8884d8]"></span>
                                    <span>2024-2025</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#82ca9d]"></span>
                                    <span>2025-2026</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                 {activeTab === 'distributions' && (
                    <div className="pt-6 text-center text-gray-500">
                        Distribution chart will be displayed here.
                    </div>
                )}
            </section>

        </AuthenticatedLayout>
    );
};

export default ConcernOverviewPage;

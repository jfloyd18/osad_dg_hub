import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import apiClient from '@/lib/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BookingReport {
    id: number;
    event_name: string;
    facility_name: string;
    department: string;
    organization: string;
    contact_no: string;
    event_start: string;
    event_end: string;
    estimated_people: number;
    status: string;
    submitted_at: string;
    feedback: string | null;
}

interface ConcernReport {
    id: number;
    incident_title: string;
    student_name: string;
    student_id: string;
    incident_details: string;
    status: string;
    created_at: string;
}

interface WarningReport {
    id: number;
    name: string;
    student_id: string;
    section: string;
    violation_type: string;
    details: string;
    date_of_violation: string;
    status: string;
    created_at: string;
}

type ReportType = 'all' | 'bookings' | 'concerns' | 'warnings';

const ReportPage = () => {
    const [reportType, setReportType] = useState<ReportType>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bookings, setBookings] = useState<BookingReport[]>([]);
    const [concerns, setConcerns] = useState<ConcernReport[]>([]);
    const [warnings, setWarnings] = useState<WarningReport[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasGenerated, setHasGenerated] = useState(false);

    const fetchReportData = async () => {
        if (!startDate || !endDate) {
            setError('Please select both start and end dates.');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError('Start date cannot be later than end date.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const params = {
                start_date: startDate,
                end_date: endDate,
            };

            // Fetch data based on report type
            if (reportType === 'bookings' || reportType === 'all') {
                try {
                    console.log('Fetching bookings with params:', params);
                    const bookingResponse = await apiClient.get('/api/admin/booking-requests', { params });
                    console.log('Booking response:', bookingResponse.data);
                    
                    // Handle different response structures
                    let bookingData = [];
                    if (Array.isArray(bookingResponse.data)) {
                        bookingData = bookingResponse.data;
                    } else if (bookingResponse.data.data && Array.isArray(bookingResponse.data.data)) {
                        bookingData = bookingResponse.data.data;
                    } else if (bookingResponse.data.bookings && Array.isArray(bookingResponse.data.bookings)) {
                        bookingData = bookingResponse.data.bookings;
                    }
                    
                    setBookings(bookingData);
                } catch (err) {
                    console.error('Failed to fetch bookings:', err);
                    setBookings([]);
                }
            } else {
                setBookings([]);
            }

            if (reportType === 'concerns' || reportType === 'all') {
                try {
                    console.log('Fetching concerns with params:', params);
                    const concernResponse = await apiClient.get('/api/admin/concerns', { params });
                    console.log('Concern response:', concernResponse.data);
                    
                    let concernData = [];
                    if (Array.isArray(concernResponse.data)) {
                        concernData = concernResponse.data;
                    } else if (concernResponse.data.data && Array.isArray(concernResponse.data.data)) {
                        concernData = concernResponse.data.data;
                    }
                    
                    setConcerns(concernData);
                } catch (err) {
                    console.error('Failed to fetch concerns:', err);
                    setConcerns([]);
                }
            } else {
                setConcerns([]);
            }

            if (reportType === 'warnings' || reportType === 'all') {
                try {
                    console.log('Fetching warnings with params:', params);
                    const warningResponse = await apiClient.get('/api/warnings', { params });
                    console.log('Warning response:', warningResponse.data);
                    
                    let warningData = [];
                    if (Array.isArray(warningResponse.data)) {
                        warningData = warningResponse.data;
                    } else if (warningResponse.data.data) {
                        if (Array.isArray(warningResponse.data.data)) {
                            warningData = warningResponse.data.data;
                        } else if (warningResponse.data.data.data && Array.isArray(warningResponse.data.data.data)) {
                            warningData = warningResponse.data.data.data;
                        }
                    }
                    
                    setWarnings(warningData);
                } catch (err) {
                    console.error('Failed to fetch warnings:', err);
                    setWarnings([]);
                }
            } else {
                setWarnings([]);
            }

            setHasGenerated(true);
        } catch (err: any) {
            console.error('Failed to fetch report data:', err);
            setError('Failed to generate report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return 'N/A';
        }
    };

    const formatDateTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return 'N/A';
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
            case 'dismissed':
                return 'bg-red-100 text-red-800';
            case 'resolved':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            let yPosition = 20;

            // Header
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('System Report', pageWidth / 2, yPosition, { align: 'center' });
            
            yPosition += 10;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`Date Range: ${formatDate(startDate)} - ${formatDate(endDate)}`, pageWidth / 2, yPosition, { align: 'center' });
            
            yPosition += 5;
            doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;

            // Facility Bookings
            if (bookings.length > 0) {
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Facility Booking Requests', 14, yPosition);
                yPosition += 7;

                autoTable(doc, {
                    startY: yPosition,
                    head: [['Event Name', 'Facility', 'Department', 'Date', 'Status']],
                    body: bookings.map(booking => [
                        booking.event_name || 'N/A',
                        booking.facility_name || 'N/A',
                        booking.department || 'N/A',
                        formatDate(booking.event_start),
                        booking.status || 'N/A',
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [161, 58, 58] },
                    styles: { fontSize: 9 },
                    margin: { left: 14, right: 14 },
                });

                yPosition = (doc as any).lastAutoTable.finalY + 15;
            }

            // Student Concerns
            if (concerns.length > 0) {
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }

                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Student Concerns', 14, yPosition);
                yPosition += 7;

                autoTable(doc, {
                    startY: yPosition,
                    head: [['Incident Title', 'Student Name', 'Student ID', 'Date Submitted', 'Status']],
                    body: concerns.map(concern => [
                        concern.incident_title || 'N/A',
                        concern.student_name || 'N/A',
                        concern.student_id || 'N/A',
                        formatDate(concern.created_at),
                        concern.status || 'N/A',
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [161, 58, 58] },
                    styles: { fontSize: 9 },
                    margin: { left: 14, right: 14 },
                });

                yPosition = (doc as any).lastAutoTable.finalY + 15;
            }

            // Warning Slips
            if (warnings.length > 0) {
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }

                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Warning Slips', 14, yPosition);
                yPosition += 7;

                autoTable(doc, {
                    startY: yPosition,
                    head: [['Violation Type', 'Student Name', 'Student ID', 'Section', 'Date', 'Status']],
                    body: warnings.map(warning => [
                        warning.violation_type || 'N/A',
                        warning.name || 'N/A',
                        warning.student_id || 'N/A',
                        warning.section || 'N/A',
                        formatDate(warning.date_of_violation || warning.created_at),
                        warning.status || 'N/A',
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [161, 58, 58] },
                    styles: { fontSize: 9 },
                    margin: { left: 14, right: 14 },
                });
            }

            // Summary section removed as per user request

            // Save PDF
            const filename = `report_${startDate}_to_${endDate}.pdf`;
            doc.save(filename);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please check the console for details.');
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Generate Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Generate Reports</h2>
                            <p className="text-gray-600 mb-8">
                                Generate comprehensive reports for facility bookings, student concerns, and warning slips.
                            </p>

                            {/* Filter Section */}
                            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Report Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Report Type
                                        </label>
                                        <select
                                            value={reportType}
                                            onChange={(e) => setReportType(e.target.value as ReportType)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A13A3A]"
                                        >
                                            <option value="all">All Reports</option>
                                            <option value="bookings">Facility Bookings Only</option>
                                            <option value="concerns">Student Concerns Only</option>
                                            <option value="warnings">Warning Slips Only</option>
                                        </select>
                                    </div>

                                    {/* Start Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A13A3A]"
                                        />
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A13A3A]"
                                        />
                                    </div>

                                    {/* Generate Button */}
                                    <div className="flex items-end">
                                        <button
                                            onClick={fetchReportData}
                                            disabled={loading}
                                            className="w-full px-4 py-2 bg-[#A13A3A] text-white rounded-md hover:bg-[#8B2C2C] focus:outline-none focus:ring-2 focus:ring-[#A13A3A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {loading ? 'Generating...' : 'Generate Report'}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                        <strong className="font-semibold">Error:</strong> {error}
                                    </div>
                                )}
                            </div>

                            {/* Export Button */}
                            {hasGenerated && (bookings.length > 0 || concerns.length > 0 || warnings.length > 0) && (
                                <div className="mb-6 flex justify-end">
                                    <button
                                        onClick={exportToPDF}
                                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Export to PDF
                                    </button>
                                </div>
                            )}

                            {/* Report Results */}
                            {hasGenerated && (
                                <div className="space-y-8">
                                    {/* Facility Bookings */}
                                    {bookings.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                                Facility Booking Requests ({bookings.length})
                                            </h3>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Event Name
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Facility
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Department
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Event Date
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Status
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {bookings.map((booking) => (
                                                            <tr key={booking.id} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {booking.event_name}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-500">
                                                                        {booking.facility_name}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-500">
                                                                        {booking.department}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-500">
                                                                        {formatDate(booking.event_start)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadgeClass(booking.status)}`}>
                                                                        {booking.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Student Concerns */}
                                    {concerns.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                                Student Concerns ({concerns.length})
                                            </h3>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Incident Title
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Student Name
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Student ID
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Date Submitted
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Status
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {concerns.map((concern) => (
                                                            <tr key={concern.id} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {concern.incident_title}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-500">
                                                                        {concern.student_name}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-500">
                                                                        {concern.student_id}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-500">
                                                                        {formatDate(concern.created_at)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadgeClass(concern.status)}`}>
                                                                        {concern.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Warning Slips */}
                                    {warnings.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                                Warning Slips ({warnings.length})
                                            </h3>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Violation Type
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Student Name
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Student ID
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Section
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Date
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Status
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {warnings.map((warning) => (
                                                            <tr key={warning.id} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {warning.violation_type}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-500">
                                                                        {warning.name}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-500">
                                                                        {warning.student_id}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-500">
                                                                        {warning.section}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-500">
                                                                        {formatDate(warning.date_of_violation || warning.created_at)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadgeClass(warning.status)}`}>
                                                                        {warning.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* No Results Message */}
                                    {bookings.length === 0 && concerns.length === 0 && warnings.length === 0 && (
                                        <div className="text-center py-12">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No data found</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                No records found for the selected date range and report type.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ReportPage;
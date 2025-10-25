<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BookingRequest;
use App\Models\Concern; // Changed from StudentConcern to Concern
use App\Models\WarningSlip;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Get booking requests within date range
     */
    public function getBookingReports(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();

        $bookings = BookingRequest::with('facility')
            ->whereBetween('submitted_at', [$startDate, $endDate])
            ->orderBy('submitted_at', 'desc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'event_name' => $booking->event_name,
                    'facility_name' => $booking->facility->name ?? 'N/A',
                    'department' => $booking->department,
                    'organization' => $booking->organization,
                    'contact_no' => $booking->contact_no,
                    'event_start' => $booking->event_start,
                    'event_end' => $booking->event_end,
                    'estimated_people' => $booking->estimated_people,
                    'status' => $booking->status,
                    'submitted_at' => $booking->submitted_at,
                    'feedback' => $booking->feedback,
                    'purpose' => $booking->purpose,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $bookings,
            'count' => $bookings->count(),
        ]);
    }

    /**
     * Get student concerns within date range
     */
    public function getConcernReports(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();

        $concerns = Concern::whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($concern) {
                return [
                    'id' => $concern->id,
                    'incident_title' => $concern->incident_title,
                    'student_name' => $concern->student_name,
                    'student_id' => $concern->student_id,
                    'incident_details' => $concern->incident_details,
                    'status' => $concern->status,
                    'created_at' => $concern->created_at,
                    'updated_at' => $concern->updated_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $concerns,
            'count' => $concerns->count(),
        ]);
    }

    /**
     * Get warning slips within date range
     */
    public function getWarningReports(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();

        $warnings = WarningSlip::whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($warning) {
                return [
                    'id' => $warning->id,
                    'name' => $warning->name,
                    'student_id' => $warning->student_id,
                    'section' => $warning->section,
                    'violation_type' => $warning->violation_type,
                    'details' => $warning->details,
                    'date_of_violation' => $warning->date_of_violation,
                    'status' => $warning->status,
                    'created_at' => $warning->created_at,
                    'updated_at' => $warning->updated_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $warnings,
            'count' => $warnings->count(),
        ]);
    }

    /**
     * Get all reports within date range
     */
    public function getAllReports(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();

        // Get bookings
        $bookings = BookingRequest::with('facility')
            ->whereBetween('submitted_at', [$startDate, $endDate])
            ->orderBy('submitted_at', 'desc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'event_name' => $booking->event_name,
                    'facility_name' => $booking->facility->name ?? 'N/A',
                    'department' => $booking->department,
                    'organization' => $booking->organization,
                    'contact_no' => $booking->contact_no,
                    'event_start' => $booking->event_start,
                    'event_end' => $booking->event_end,
                    'estimated_people' => $booking->estimated_people,
                    'status' => $booking->status,
                    'submitted_at' => $booking->submitted_at,
                    'feedback' => $booking->feedback,
                    'purpose' => $booking->purpose,
                ];
            });

        // Get concerns
        $concerns = Concern::whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($concern) {
                return [
                    'id' => $concern->id,
                    'incident_title' => $concern->incident_title,
                    'student_name' => $concern->student_name,
                    'student_id' => $concern->student_id,
                    'incident_details' => $concern->incident_details,
                    'status' => $concern->status,
                    'created_at' => $concern->created_at,
                    'updated_at' => $concern->updated_at,
                ];
            });

        // Get warnings
        $warnings = WarningSlip::whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($warning) {
                return [
                    'id' => $warning->id,
                    'name' => $warning->name,
                    'student_id' => $warning->student_id,
                    'section' => $warning->section,
                    'violation_type' => $warning->violation_type,
                    'details' => $warning->details,
                    'date_of_violation' => $warning->date_of_violation,
                    'status' => $warning->status,
                    'created_at' => $warning->created_at,
                    'updated_at' => $warning->updated_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'bookings' => $bookings,
                'concerns' => $concerns,
                'warnings' => $warnings,
            ],
            'summary' => [
                'total_bookings' => $bookings->count(),
                'total_concerns' => $concerns->count(),
                'total_warnings' => $warnings->count(),
                'date_range' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString(),
                ],
            ],
        ]);
    }
}
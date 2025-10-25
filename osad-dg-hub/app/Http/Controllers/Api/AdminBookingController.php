<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminBookingController extends Controller
{
    /**
     * Get all booking requests with stats for admin overview
     * Also supports date filtering for reports
     */
    public function index(Request $request)
    {
        // Check if this is a report request (has date filters)
        $isReportRequest = $request->has('start_date') && $request->has('end_date');

        if ($isReportRequest) {
            // Handle report data with date filtering
            return $this->getReportData($request);
        }

        // Original dashboard data (no date filtering)
        return $this->getDashboardData();
    }

    /**
     * Get dashboard data (original functionality)
     */
    private function getDashboardData()
    {
        // Get statistics
        $stats = [
            'total' => BookingRequest::count(),
            'pending' => BookingRequest::where('status', 'Pending')->count(),
            'approved' => BookingRequest::where('status', 'Approved')->count(),
            'rejected' => BookingRequest::where('status', 'Rejected')->count(),
        ];

        // Get recent requests (last 10)
        $recentRequests = BookingRequest::with('user')
            ->orderBy('submitted_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'event_name' => $request->event_name,
                    'submitted_at' => $request->submitted_at,
                    'status' => $request->status,
                    'feedback' => $request->feedback,
                    'department' => $request->department,
                    'organization' => $request->organization,
                    'contact_no' => $request->contact_no,
                    'facility_name' => $request->facility_name,
                    'estimated_people' => $request->estimated_people,
                    'event_start' => $request->event_start,
                    'event_end' => $request->event_end,
                    'purpose' => $request->purpose,
                    'user_name' => $request->user ? $request->user->name : 'Unknown',
                ];
            });

        // Get most booked facilities
        $mostBooked = BookingRequest::select('facility_name', DB::raw('count(*) as bookings'))
            ->groupBy('facility_name')
            ->orderBy('bookings', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recentRequests' => $recentRequests,
            'mostBooked' => $mostBooked,
        ]);
    }

    /**
     * Get report data with date filtering (new functionality)
     */
    private function getReportData(Request $request)
    {
        try {
            $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
            ]);

            $startDate = Carbon::parse($request->start_date)->startOfDay();
            $endDate = Carbon::parse($request->end_date)->endOfDay();

            $bookings = BookingRequest::with('user')
                ->whereBetween('submitted_at', [$startDate, $endDate])
                ->orderBy('submitted_at', 'desc')
                ->get()
                ->map(function ($booking) {
                    return [
                        'id' => $booking->id,
                        'event_name' => $booking->event_name,
                        'facility_name' => $booking->facility_name,
                        'department' => $booking->department,
                        'organization' => $booking->organization,
                        'contact_no' => $booking->contact_no,
                        'event_start' => $booking->event_start,
                        'event_end' => $booking->event_end,
                        'estimated_people' => $booking->estimated_people,
                        'status' => $booking->status,
                        'submitted_at' => $booking->submitted_at,
                        'feedback' => $booking->feedback,
                        'purpose' => $booking->purpose ?? '',
                        'user_name' => $booking->user ? $booking->user->name : 'Unknown',
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $bookings,
                'count' => $bookings->count(),
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching booking report data: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch booking requests',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the status of a booking request
     */
    public function updateStatus(Request $request, BookingRequest $bookingRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Approved,Rejected',
            'feedback' => 'nullable|string|max:500',
        ]);

        $bookingRequest->status = $validated['status'];
        
        if (isset($validated['feedback'])) {
            $bookingRequest->feedback = $validated['feedback'];
        }

        $bookingRequest->save();

        return redirect()->back()->with('success', 'Booking request status updated successfully!');
    }
}
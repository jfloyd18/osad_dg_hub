<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminBookingController extends Controller
{
    /**
     * Get all booking requests with stats for admin overview
     */
    public function index()
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

        return response()->json([
            'message' => 'Booking request status updated successfully',
            'data' => $bookingRequest,
        ]);
    }
}
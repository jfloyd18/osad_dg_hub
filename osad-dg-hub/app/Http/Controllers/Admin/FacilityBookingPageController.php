<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use App\Models\Facility;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class FacilityBookingPageController extends Controller
{
    /**
     * Display the admin facility booking overview page.
     *
     * @return \Inertia\Response
     */
    public function overview()
    {
        // Get statistics
        $stats = [
            'total' => BookingRequest::count(),
            'pending' => BookingRequest::where('status', 'Pending')->count(),
            'approved' => BookingRequest::where('status', 'Approved')->count(),
            'rejected' => BookingRequest::where('status', 'Rejected')->count(),
        ];

        // Get recent requests (latest 10)
        $recentRequests = BookingRequest::latest('created_at')
            ->take(10)
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'event_name' => $request->event_name,
                    'submitted_at' => $request->created_at,
                    'status' => $request->status,
                    'feedback' => $request->feedback,
                    'department' => $request->department ?? 'N/A',
                    'purpose' => $request->purpose ?? 'N/A',
                ];
            });

        // Get most booked facilities
        $mostBooked = BookingRequest::select('facility_id', DB::raw('COUNT(*) as bookings'))
            ->groupBy('facility_id')
            ->orderBy('bookings', 'desc')
            ->take(5)
            ->with('facility')
            ->get()
            ->map(function ($item) {
                return [
                    'facility_name' => $item->facility->facility_name ?? 'Unknown Facility',
                    'bookings' => $item->bookings,
                ];
            });

        return Inertia::render('Admin/FacilityBooking/Overview', [
            'stats' => $stats,
            'recentRequests' => $recentRequests,
            'mostBooked' => $mostBooked,
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Concern;
// use App\Models\BookingRequest; // Uncomment this if you have a BookingRequest model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function getData()
    {
        // --- Stat Cards Data ---
        $concernStats = [
            'total' => Concern::count(),
            'pending' => Concern::where('status', 'Pending')->count(),
            'approved' => Concern::where('status', 'Approved')->count(),
            'rejected' => Concern::where('status', 'Rejected')->count(),
        ];

        // --- Recent Requests Table Data ---
        $recentConcerns = Concern::orderBy('created_at', 'desc')->limit(5)->get();

        // --- Most Booked Facility Chart Data (Example) ---
        // This is a placeholder. You'll need to adjust 'booking_requests' and 'facility_name'
        // to match your actual table and column names for facility bookings.
        $mostBooked = DB::table('booking_requests') // IMPORTANT: Change 'booking_requests' if your table name is different
                         ->select('facility_name', DB::raw('count(*) as total')) // IMPORTANT: Change 'facility_name' if your column name is different
                         ->groupBy('facility_name')
                         ->orderBy('total', 'desc')
                         ->limit(3)
                         ->get();

        return response()->json([
            'stats' => $concernStats,
            'recentRequests' => $recentConcerns,
            'mostBookedFacilities' => $mostBooked,
        ]);
    }
}
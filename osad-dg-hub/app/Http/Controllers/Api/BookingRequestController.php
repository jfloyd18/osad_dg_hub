<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use App\Models\User;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BookingRequestController extends Controller
{
    private function getPlaceholderUser()
    {
        $user = User::first();
        if (!$user) {
            abort(404, 'No users found in the database.');
        }
        return $user;
    }

    public function index()
    {
        $user = $this->getPlaceholderUser();
        return $user->bookingRequests()->orderBy('created_at', 'desc')->get();
    }

    public function stats()
    {
        $user = $this->getPlaceholderUser();
        return response()->json([
            'total' => $user->bookingRequests()->count(),
            'pending' => $user->bookingRequests()->where('status', 'Pending')->count(),
            'approved' => $user->bookingRequests()->where('status', 'Approved')->count(),
            'rejected' => $user->bookingRequests()->where('status', 'Rejected')->count(),
        ]);
    }

    public function mostBooked()
    {
        $user = $this->getPlaceholderUser();
        $mostBooked = $user->bookingRequests()
            ->select('facility_name', DB::raw('count(*) as bookings'))
            ->groupBy('facility_name')
            ->orderBy('bookings', 'desc')
            ->limit(3)
            ->get();
        return response()->json($mostBooked);
    }

    /**
     * Store a newly created booking request in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'department' => 'required|string|max:255',
            'organization' => 'required|string|max:255',
            'contact_no' => 'required|string|max:20',
            'event_name' => 'required|string|max:255',
            'facility_id' => 'required|integer|exists:facilities,id',
            'estimated_people' => 'required|integer|min:1',
            'event_start_date' => 'required|date_format:Y-m-d',
            'event_start_time' => 'required|date_format:H:i',
            'event_end_date' => 'required|date_format:Y-m-d',
            'event_end_time' => 'required|date_format:H:i',
            'purpose' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Combine date and time into datetime format
            $startDateTime = Carbon::parse($request->input('event_start_date') . ' ' . $request->input('event_start_time'));
            $endDateTime = Carbon::parse($request->input('event_end_date') . ' ' . $request->input('event_end_time'));

            // Validate that end time is after start time
            if ($endDateTime->lte($startDateTime)) {
                return response()->json([
                    'errors' => ['event_end_time' => ['Event end time must be after start time']]
                ], 422);
            }

            // Get the facility name from the facility_id
            $facility = Facility::find($request->input('facility_id'));
            if (!$facility) {
                return response()->json([
                    'errors' => ['facility_id' => ['Selected facility not found']]
                ], 422);
            }

            // Create the booking request
            $bookingRequest = BookingRequest::create([
                'user_id' => $this->getPlaceholderUser()->id,
                'department' => $request->input('department'),
                'organization' => $request->input('organization'),
                'contact_no' => $request->input('contact_no'),
                'event_name' => $request->input('event_name'),
                'facility_id' => $request->input('facility_id'),
                'facility_name' => $facility->name, // Add facility name
                'estimated_people' => $request->input('estimated_people'),
                'event_start' => $startDateTime->format('Y-m-d H:i:s'),
                'event_end' => $endDateTime->format('Y-m-d H:i:s'),
                'purpose' => $request->input('purpose'),
                'status' => 'Pending',
                'submitted_at' => now(),
            ]);

            return response()->json([
                'message' => 'Booking request submitted successfully!',
                'data' => $bookingRequest
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Booking request error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
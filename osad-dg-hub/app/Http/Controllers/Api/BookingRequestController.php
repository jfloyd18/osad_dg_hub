<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BookingRequest;
use App\Models\Facility;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class BookingRequestController extends Controller
{
    public function facilities()
    {
        try {
            $facilities = Facility::orderBy('name')->get();
            return response()->json($facilities);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve facilities', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to retrieve facilities'], 500);
        }
    }

    public function stats()
    {
        $stats = [
            'total' => BookingRequest::count(),
            'pending' => BookingRequest::where('status', 'Pending')->count(),
            'approved' => BookingRequest::where('status', 'Approved')->count(),
            'rejected' => BookingRequest::where('status', 'Rejected')->count(),
        ];
        return response()->json($stats);
    }

    // app/Http/Controllers/Api/BookingRequestController.php

    // app/Http/Controllers/Api/BookingRequestController.php

public function index()
{
    // Check if a user is logged in
    if (Auth::check()) {
        // If logged in, get their specific requests
        $user = Auth::user();
        $requests = BookingRequest::where('user_id', $user->id)
                                    ->latest('submitted_at')
                                    ->take(10)
                                    ->get();
    } else {
        // --- THIS IS THE CHANGE ---
        // If not logged in, get the 10 most recent requests from ALL users.
        $requests = BookingRequest::latest('submitted_at')
                                    ->take(10)
                                    ->get();
    }

    return response()->json($requests);
}

    public function mostBooked()
    {
        $facilities = BookingRequest::select('facility_name as name', DB::raw('count(*) as bookings'))
            ->where('status', 'Approved')
            ->groupBy('facility_name')
            ->orderBy('bookings', 'desc')
            ->take(5)
            ->get();
        return response()->json($facilities);
    }

    public function store(Request $request)
    {
        Log::info('Incoming booking request', $request->all());

        $validator = Validator::make($request->all(), [
            'department' => 'nullable|string|max:255',
            'organization' => 'nullable|string|max:255',
            'contact_no' => 'required|string|max:20',
            'event_name' => 'required|string|max:255',
            'facility_name' => 'required|string|exists:facilities,name',
            'estimated_people' => 'required|integer|min:1',
            'event_start' => 'required|date',
            'event_end' => 'required|date|after_or_equal:event_start',
            'purpose' => 'required|string|min:5',
        ]);

        if ($validator->fails()) {
            Log::warning('Validation failed', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        try {
            $facility = Facility::where('name', $data['facility_name'])->firstOrFail();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Facility not found', ['name' => $data['facility_name']]);
            return response()->json(['message' => 'The selected facility could not be found.'], 404);
        }

        $bookingData = [
            // --- CHANGE: Use the logged-in user's ID, or default to 1 for guests ---
            'user_id' => Auth::id() ?? 1,
            'department' => $data['department'] ?? null,
            'organization' => $data['organization'] ?? null,
            'contact_no' => $data['contact_no'],
            'event_name' => $data['event_name'],
            'facility_id' => $facility->id,
            'facility_name' => $data['facility_name'],
            'estimated_people' => $data['estimated_people'],
            'event_start' => $data['event_start'],
            'event_end' => $data['event_end'],
            'purpose' => $data['purpose'],
            'status' => 'Pending',
            'submitted_at' => now(),
        ];

        try {
            $bookingRequest = BookingRequest::create($bookingData);
            return response()->json([
                'message' => 'Booking request submitted successfully!',
                'data' => $bookingRequest
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create booking request', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to create booking request', 'error' => $e->getMessage()], 500);
        }
    }
}
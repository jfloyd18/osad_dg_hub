<?php

namespace App\Http\Controllers;

use App\Models\BookingRequest;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Carbon\Carbon; // <-- Add this import for date handling

class BookingRequestController extends Controller
{
    /**
     * Display a listing of the user's booking requests.
     */
    public function index()
    {
        $requests = BookingRequest::where('user_id', Auth::id())
            ->latest('submitted_at')
            ->get();

        $stats = [
            'total' => $requests->count(),
            'pending' => $requests->where('status', 'Pending')->count(),
            'approved' => $requests->where('status', 'Approved')->count(),
            'rejected' => $requests->where('status', 'Rejected')->count(),
        ];

        return Inertia::render('FacilityBooking/Overview', [
            'requests' => $requests,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created booking request in storage.
     */
    public function store(Request $request)
    {
        // 1. Validate all the incoming form data
        $validated = $request->validate([
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

        // 2. Combine date/time and validate the time range
        $startDateTime = Carbon::parse($validated['event_start_date'] . ' ' . $validated['event_start_time']);
        $endDateTime = Carbon::parse($validated['event_end_date'] . ' ' . $validated['event_end_time']);

        if ($endDateTime->lte($startDateTime)) {
            return back()->withErrors(['event_end_time' => 'Event end time must be after the start time.']);
        }

        // 3. Find the facility to get its name
        $facility = Facility::findOrFail($validated['facility_id']);

        // 4. Create the booking request associated with the logged-in user
        BookingRequest::create([
            'user_id' => Auth::id(),
            'department' => $validated['department'],
            'organization' => $validated['organization'],
            'contact_no' => $validated['contact_no'],
            'event_name' => $validated['event_name'],
            'facility_id' => $validated['facility_id'],
            'facility_name' => $facility->name,
            'estimated_people' => $validated['estimated_people'],
            'purpose' => $validated['purpose'],
            'event_start' => $startDateTime,
            'event_end' => $endDateTime,
            'status' => 'Pending',
            'submitted_at' => now(),
        ]);

        // 5. Redirect back to the request page with a success flash message
        return redirect()->route('facility-booking.request')->with('success', 'Request submitted successfully!');
    }

    /**
     * Display the specified booking request.
     */
    public function show(BookingRequest $bookingRequest)
    {
        Gate::authorize('view', $bookingRequest); // Authorize view

        return Inertia::render('FacilityBooking/Show', [
            'request' => $bookingRequest->load('facility'),
            'facilities' => Facility::all(), // For the dropdown in edit mode
        ]);
    }

    /**
     * Update the specified booking request in storage.
     */
    public function update(Request $request, BookingRequest $bookingRequest)
    {
        Gate::authorize('update', $bookingRequest); // Authorize update

        $validated = $request->validate([
            'event_name' => 'required|string|max:255',
            'facility_id' => 'required|integer|exists:facilities,id',
            'purpose' => 'required|string',
            // Define other editable fields here
        ]);

        $bookingRequest->update($validated);

        return redirect()->route('facility-booking.overview')->with('success', 'Request updated successfully!');
    }
}
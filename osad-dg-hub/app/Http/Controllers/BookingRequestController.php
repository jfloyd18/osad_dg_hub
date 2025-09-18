<?php

namespace App\Http\Controllers;

use App\Models\BookingRequest;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

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
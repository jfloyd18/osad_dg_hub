<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest; // Make sure you have a BookingRequest model
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    /**
     * Fetch all booking requests for the admin overview.
     */
    public function index()
    {
        // Fetch all requests, ordering by the newest first
        $requests = BookingRequest::orderBy('created_at', 'desc')->get();
        return response()->json($requests);
    }

    /**
     * Update the status of a specific booking request.
     */
    public function updateStatus(Request $request, BookingRequest $bookingRequest)
    {
        // Validate the incoming data
        $validated = $request->validate([
            'status' => 'required|string|in:Approved,Rejected', // Only allow these two values
            'feedback' => 'nullable|string', // Feedback is optional
        ]);

        // Update the request's status and feedback
        $bookingRequest->status = $validated['status'];
        $bookingRequest->feedback = $validated['feedback'];
        $bookingRequest->save();

        return response()->json([
            'message' => 'Request status updated successfully!',
            'bookingRequest' => $bookingRequest,
        ]);
    }
}
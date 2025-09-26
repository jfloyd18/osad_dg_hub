<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Concern;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Import the Auth facade

class ConcernController extends Controller
{
    /**
     * Get all concerns for the main overview table.
     */
    public function overview()
    {
        $concerns = Concern::latest()->get(); 

        return response()->json([
            'data' => $concerns,
        ]);
    }

    /**
     * Store a newly created concern in storage.
     */
    public function store(Request $request)
    {
        // 1. Validate the incoming data
        $validatedData = $request->validate([
            'incident_title' => 'required|string|max:255',
            'details' => 'required|string',
            'incident_date' => 'required|date', // Validate the incident date
        ]);

        // 2. Get the currently authenticated user
        $user = Auth::user();

        // Ensure a user is logged in
        if (!$user || !$user->student_id) {
            return response()->json(['message' => 'User not authenticated or missing Student ID.'], 401);
        }

        // 3. Create a new Concern model instance
        $concern = new Concern();
        $concern->incident_title = $validatedData['incident_title'];
        $concern->details = $validatedData['details'];
        $concern->status = 'Pending';

        // --- FIX IS HERE ---
        // Automatically assign the logged-in user's student ID to the concern.
        $concern->student_id = $user->student_id; 
        
        // Save the incident date from the form
        // Make sure you have an 'incident_date' column in your 'concerns' table
        $concern->incident_date = $validatedData['incident_date'];

        // 4. Save the new concern to the database
        $concern->save();

        // 5. Return a success response
        return response()->json([
            'message' => 'Incident report submitted successfully!',
            'concern' => $concern
        ], 201);
    }
}


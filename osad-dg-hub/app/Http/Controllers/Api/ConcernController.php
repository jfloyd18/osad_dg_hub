<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Concern;
use Illuminate\Http\Request;

class ConcernController extends Controller
{
    /**
     * Get the dashboard statistics and recent concerns.
     */
    public function overview()
    {
        // ... (your existing overview code is perfect)
        $total = Concern::count();
        $pending = Concern::where('status', 'Pending')->count();
        $approved = Concern::where('status', 'Approved')->count();
        $rejected = Concern::where('status', 'Rejected')->count();
        $recentConcerns = Concern::orderBy('created_at', 'desc')->limit(5)->get();

        return response()->json([
            'stats' => [
                'total' => $total,
                'pending' => $pending,
                'approved' => $approved,
                'rejected' => $rejected,
            ],
            'recentRequests' => $recentConcerns,
        ]);
    }

    /**
     * Store a newly created concern in storage.
     */
    public function store(Request $request)
    {
        // 1. Validate the incoming data to make sure it's not empty
        $validatedData = $request->validate([
            'incident_title' => 'required|string|max:255',
            'details' => 'required|string',
        ]);

        // 2. Create a new Concern model instance
        $concern = new Concern();
        $concern->incident_title = $validatedData['incident_title'];
        $concern->details = $validatedData['details'];
        $concern->status = 'Pending'; // Set a default status

        // 3. Save the new concern to the database
        $concern->save();

        // 4. Return a success response
        return response()->json([
            'message' => 'Incident report submitted successfully!',
            'concern' => $concern
        ], 201); // 201 means "Created"
    }
}
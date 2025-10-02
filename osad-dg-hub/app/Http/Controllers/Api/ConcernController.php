<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Concern;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConcernController extends Controller
{
    /**
     * Get overview data for the logged-in student.
     */
    public function overview()
{
    $user = Auth::user();

    // FOR TESTING: Use fallback student_id
    if (!$user || !$user->student_id) {
        $studentId = '230000002773';
    } else {
        $studentId = $user->student_id;
    }

    // Debug: Log the student_id being used
    \Log::info('Overview - Using student_id: ' . $studentId);

    // Fetch all concerns for this student
    $allConcerns = Concern::where('student_id', $studentId)->get();

    // Debug: Log how many concerns were found
    \Log::info('Overview - Found concerns: ' . $allConcerns->count());

    // Calculate statistics
    $stats = [
        'total' => $allConcerns->count(),
        'pending' => $allConcerns->where('status', 'Pending')->count(),
        'approved' => $allConcerns->where('status', 'Resolved')->count(),
        'rejected' => $allConcerns->where('status', 'Rejected')->count(),
    ];

    // Get recent requests (latest 5)
    $recentRequests = Concern::where('student_id', $studentId)
        ->latest('created_at')
        ->take(5)
        ->get()
        ->map(function ($concern) {
            return [
                'id' => $concern->id,
                'incident_title' => $concern->incident_title,
                'submitted_at' => $concern->created_at->toISOString(),
                'status' => $this->mapStatus($concern->status),
                'feedback' => $concern->feedback,
            ];
        });

    return response()->json([
        'stats' => $stats,
        'recentRequests' => $recentRequests,
    ]);
}

    /**
     * Map database status to frontend status format.
     */
    private function mapStatus($dbStatus)
    {
        $statusMap = [
            'Pending' => 'Pending',
            'On Progress' => 'Revisions',
            'Resolved' => 'Approved',
            'Rejected' => 'Rejected',
        ];

        return $statusMap[$dbStatus] ?? 'Pending';
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
            'incident_date' => 'required|date',
        ]);

        // 2. Get the currently authenticated user
        $user = Auth::user();

        // FOR TESTING: Use fallback if no user authenticated
        // TODO: Remove this fallback after authentication is properly set up
        if (!$user || !$user->student_id) {
            $studentId = '230000002773'; // Fallback for testing
        } else {
            $studentId = $user->student_id;
        }

        // 3. Create a new Concern model instance
        $concern = new Concern();
        $concern->incident_title = $validatedData['incident_title'];
        $concern->details = $validatedData['details'];
        $concern->status = 'Pending';
        $concern->student_id = $studentId;
        $concern->incident_date = $validatedData['incident_date'];

        // 4. Save the new concern to the database
        $concern->save();

        // 5. Return a success response
        return response()->json([
            'message' => 'Incident report submitted successfully!',
            'concern' => $concern
        ], 201);
    }

    public function show($id)
{
    $concern = Concern::findOrFail($id);
    return response()->json($concern);
}

public function update(Request $request, $id)
{
    $concern = Concern::findOrFail($id);
    
    if ($concern->status !== 'Pending') {
        return response()->json([
            'message' => 'Cannot edit concern. Only pending concerns can be edited.'
        ], 403);
    }
    
    $validatedData = $request->validate([
        'incident_title' => 'required|string|max:255',
        'details' => 'required|string',
        'incident_date' => 'required|date',
    ]);
    
    $concern->update($validatedData);
    
    return response()->json([
        'message' => 'Concern updated successfully!',
        'concern' => $concern
    ]);
}


    /**
 * Get all concerns for admin (not filtered by student_id)
 */
public function adminIndex()
{
    $concerns = Concern::latest('created_at')
        ->get()
        ->map(function ($concern) {
            return [
                'id' => $concern->id,
                'incident_title' => $concern->incident_title,
                'details' => $concern->details,
                'student_id' => $concern->student_id,
                'submitted_at' => $concern->created_at->toISOString(),
                'status' => $concern->status,
                'feedback' => $concern->feedback,
                'incident_date' => $concern->incident_date,
                'created_at' => $concern->created_at->toISOString(),
            ];
        });

    return response()->json([
        'data' => $concerns,
    ]);
}


}
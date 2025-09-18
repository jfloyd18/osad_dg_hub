<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WarningSlip;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarningSlipController extends Controller
{
    /**
     * Display the form to create a new warning slip.
     */
    public function create()
    {
        // Fetch data for the sidebar widgets
        $recentWarnings = WarningSlip::latest()->take(3)->get();
        $concernTrends = WarningSlip::select('violation_type')
            ->selectRaw('count(*) as count')
            ->groupBy('violation_type')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/WarningSlipPage', [
            'recentWarnings' => $recentWarnings,
            'concernTrends' => $concernTrends,
        ]);
    }

    /**
     * Store a newly created warning slip in storage.
     */
    public function store(Request $request)
    {
        // Validate the admin's input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'section' => 'required|string|max:255',
            'student_id' => 'required|string|max:255',
            'age' => 'required|integer|min:1',
            'current_address' => 'required|string|max:255',
            'home_address' => 'required|string|max:255',
            'mobile_no' => 'required|string|max:20',
            'violation_type' => 'required|string|max:255',
        ]);
        
        // Find the student by their ID or create a new user profile for them
        $user = User::firstOrCreate(
            ['student_id' => $validated['student_id']],
            [
                'name' => $validated['name'], 
                'email' => $validated['student_id'].'@university.example.com', // Use a placeholder email
                'password' => bcrypt(str()->random(12)) // Create a random, secure password
            ]
        );

        // Create the warning slip and associate it with the student's user ID
        WarningSlip::create(array_merge($validated, [
            'user_id' => $user->id,
            'status' => 'Pending', // Or 'Issued', depending on your workflow
            'date_of_violation' => now(),
        ]));

        return redirect()->route('admin.warning-slip.create')->with('success', 'Warning slip issued successfully!');
    }
}

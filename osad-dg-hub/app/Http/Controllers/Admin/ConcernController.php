<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Concern;
use App\Models\User; // Import the User model
use Inertia\Inertia;

class ConcernController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/StudentConcern/ConcernOverviewPage');
    }

    /**
     * Display the details of a single concern.
     */
    public function show(Concern $concern)
    {
        // FIX: Find the user (reporter) based on the student_id stored with the concern.
        // This enriches the data before sending it to the frontend.
        $reporter = null;
        if ($concern->student_id) {
            $reporter = User::where('student_id', $concern->student_id)->first();
        }

        // Pass both the concern data and the reporter's data to the page.
        return Inertia::render('Admin/StudentConcern/ConcernDetailPage', [
            'concern' => $concern,
            'reporter' => $reporter,
        ]);
    }
}


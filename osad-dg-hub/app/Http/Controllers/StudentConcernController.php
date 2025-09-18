<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- Add this import
use Inertia\Inertia;

class StudentConcernController extends Controller
{
    /**
     * Display the concern overview page.
     */
    public function showOverview()
    {
        return Inertia::render('StudentConcern/ConcernOverviewPage');
    }

    /**
     * Display the incident report form.
     */
    public function showIncidentReportForm()
    {
        return Inertia::render('StudentConcern/IncidentReportPage');
    }

    /**
     * Display the view warnings page.
     */
    public function showWarnings()
    {
        // For the next step, we will add data fetching here.
        // For now, it just renders the page.
        return Inertia::render('StudentConcern/ViewWarningsPage');
    }

    /**
     * --- FIX IS HERE: ADDED THE MISSING METHOD ---
     * Display the form for a student to file a warning slip report.
     */
    public function showWarningSlipForm()
    {
        $student = Auth::user();

        // This passes the student's data to your React page
        // It's important that your 'users' table has 'student_id' and 'section' columns
        return Inertia::render('StudentConcern/WarningSlipPage', [
            'student' => [
                'name' => $student->name,
                'student_id' => $student->student_id ?? 'Not Set',
                'section' => $student->section ?? 'Not Set',
            ]
        ]);
    }
}
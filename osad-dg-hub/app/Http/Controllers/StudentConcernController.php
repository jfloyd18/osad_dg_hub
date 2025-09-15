<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia; // <-- Make sure to import Inertia

class StudentConcernController extends Controller
{
    /**
     * Display the concern overview page.
     */
    public function showOverview()
    {
        // Note: The component path matches your file structure:
        // resources/js/pages/StudentConcern/ConcernOverviewPage.tsx
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
        return Inertia::render('StudentConcern/ViewWarningsPage');
    }
}
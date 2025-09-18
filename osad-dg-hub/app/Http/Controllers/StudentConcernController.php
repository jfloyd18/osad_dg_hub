<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        return Inertia::render('StudentConcern/ViewWarningsPage');
    }

    // The old showWarningSlipForm method has been removed from this controller.
}

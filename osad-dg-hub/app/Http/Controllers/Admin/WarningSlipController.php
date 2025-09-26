<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\WarningSlip;
use Illuminate\Support\Facades\Redirect;

class WarningSlipController extends Controller
{
    /**
     * Display the blank warning slip form for an admin.
     */
    public function create()
    {
        return Inertia::render('Admin/StudentConcern/WarningSlipPage', [
            'student' => [
                'name' => '',
                'student_id' => '',
                'section' => '',
            ]
        ]);
    }

    /**
     * Store a new warning slip submitted by an admin.
     */
    public function store(Request $request)
    {
        // Validate the incoming data from the form
        $validated = $request->validate([
            'student_name' => 'required|string|max:255',
            'student_id' => 'nullable|string|max:255',
            'section' => 'nullable|string|max:255',
            'age' => 'nullable|integer',
            'address' => 'nullable|string',
            'home_address' => 'nullable|string',
            'mobile_no' => 'nullable|string|max:20',
            'incident_type' => 'required|string|max:255',
            'incident_description' => 'required|string',
        ]);

        // This part remains the same.
        // You will need to create a 'WarningSlip' model and migration for this to work.
        // WarningSlip::create($validated);

        // Redirect the admin back to their dashboard with a success message.
        return Redirect::route('admin.dashboard')->with('success', 'Warning slip created successfully.');
    }

    public function overview()
    {
        return Inertia::render('Admin/StudentConcern/WarningOverviewPage');
    }

    /**
     * Display the specified warning slip.
     *
     * @param  \App\Models\WarningSlip  $warningSlip
     * @return \Inertia\Response
     */
    public function show(WarningSlip $warningSlip)
    {
        // The $warningSlip model is automatically fetched from the database by route-model binding.
        // We then pass it as a prop to the React component.
        return Inertia::render('Admin/StudentConcern/WarningDetailPage', [
            'warning' => $warningSlip
        ]);
    }
}

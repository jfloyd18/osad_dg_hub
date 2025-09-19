<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Concern;
use Inertia\Inertia;

class ConcernController extends Controller
{
    public function index()
    {
        // Fetch all concerns from the database
        $concerns = Concern::all();

        return Inertia::render('Admin/StudentConcern/ConcernOverviewPage', [
            'concerns' => $concerns,
        ]);
    }
}
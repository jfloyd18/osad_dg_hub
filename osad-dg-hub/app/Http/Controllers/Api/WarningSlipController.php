<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller; // <-- THIS FIXES THE SAME PROBLEM IN THIS FILE
use App\Models\WarningSlip;
use Illuminate\Http\Request;

class WarningSlipController extends Controller
{
    /**
     * Display a listing of the warning slips.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Fetches all records from the 'warning_slips' table
        $warnings = WarningSlip::all();

        // Returns the data as JSON
        return response()->json($warnings);
    }
}
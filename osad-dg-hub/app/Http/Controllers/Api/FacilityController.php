<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility; // Uses your existing Facility model
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    /**
     * Fetch all facilities for the dropdown menu.
     */
    public function index()
    {
        try {
            // Fetch all records from the 'facilities' table
            $facilities = Facility::all();
            
            // Return the list as a JSON response
            return response()->json($facilities);

        } catch (\Exception $e) {
            // Return an error if something goes wrong
            return response()->json(['message' => 'Could not load facilities.'], 500);
        }
    }
}
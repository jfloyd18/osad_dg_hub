<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WarningSlip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class WarningSlipController extends Controller
{
    /**
     * Store a newly created warning slip.
     */
    public function store(Request $request)
    {
        // Log the incoming request for debugging
        Log::info('Warning Slip Request Data:', $request->all());

        // Validate the incoming data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'student_id' => 'required|string|max:50',
            'section' => 'required|string|max:50',
            'current_address' => 'required|string|max:1000',
            'home_address' => 'required|string|max:1000',
            'mobile_no' => 'required|string|max:20',
            'violation_type' => 'required|string|max:100',
            'details' => 'required|string|max:5000',
            'date_of_violation' => 'required|date',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Use database transaction for data integrity
        DB::beginTransaction();

        try {
            // Check if the warning_slips table exists
            if (!Schema::hasTable('warning_slips')) {
                throw new \Exception('Warning slips table does not exist. Please run migrations.');
            }

            $warningSlip = WarningSlip::create([
                'name' => $request->name,
                'student_id' => $request->student_id,
                'section' => $request->section,
                'current_address' => $request->current_address,
                'home_address' => $request->home_address,
                'mobile_no' => $request->mobile_no,
                'violation_type' => $request->violation_type,
                'details' => $request->details,
                'date_of_violation' => $request->date_of_violation,
                'status' => 'pending',
            ]);

            DB::commit();

            Log::info('Warning slip created successfully:', ['id' => $warningSlip->id]);

            return response()->json([
                'message' => 'Warning slip created successfully',
                'data' => $warningSlip
            ], 201);

        } catch (\Illuminate\Database\QueryException $e) {
            DB::rollback();
            Log::error('Database Error: ' . $e->getMessage());
            Log::error('SQL Error Code: ' . $e->getCode());
            
            return response()->json([
                'message' => 'Database error occurred',
                'error' => config('app.debug') ? $e->getMessage() : 'Please check your database configuration'
            ], 500);

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Warning Slip Creation Error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'An error occurred while creating the warning slip',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Display a listing of warning slips.
     */
    public function index(Request $request)
    {
        try {
            $query = WarningSlip::query();

            // Add filtering if needed
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('student_id')) {
                $query->where('student_id', 'like', '%' . $request->student_id . '%');
            }

            $warningSlips = $query->latest('created_at')->paginate(10);
            
            return response()->json([
                'message' => 'Warning slips retrieved successfully',
                'data' => $warningSlips
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching warning slips: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Error fetching warning slips',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Display the specified warning slip.
     */
    public function show($id)
    {
        try {
            // Use findOrFail to automatically handle not found cases.
            $warningSlip = WarningSlip::findOrFail($id);

            return response()->json([
                'message' => 'Warning slip retrieved successfully',
                'data' => $warningSlip
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Warning slip not found'], 404);
        } 
        catch (\Exception $e) {
            Log::error('Error fetching warning slip: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Error fetching warning slip',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Update the specified warning slip status.
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,resolved,dismissed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Manually find the record using findOrFail.
            $warningSlip = WarningSlip::findOrFail($id);
            $warningSlip->update(['status' => $request->status]);

            return response()->json([
                'message' => 'Warning slip status updated successfully',
                'data' => $warningSlip
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
             return response()->json(['message' => 'Warning slip not found'], 404);
        }
        catch (\Exception $e) {
            Log::error('Error updating warning slip: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Error updating warning slip',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}


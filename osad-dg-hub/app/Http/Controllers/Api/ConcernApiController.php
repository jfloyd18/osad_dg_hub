<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Concern;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ConcernApiController extends Controller
{
    public function updateStatus(Request $request, $id)
    {
        try {
            // Log the incoming request for debugging
            Log::info('Update Status Request', [
                'concern_id' => $id,
                'status' => $request->status,
                'all_data' => $request->all()
            ]);

            // Find the concern by ID
            $concern = Concern::find($id);
            
            if (!$concern) {
                Log::error('Concern not found', ['id' => $id]);
                return response()->json([
                    'message' => 'Concern not found.'
                ], 404);
            }

            // Validate the request
            $validated = $request->validate([
                'status' => 'required|in:Pending,On Progress,Resolved,Rejected',
            ]);

            // Update the status
            $concern->status = $validated['status'];
            $concern->save();

            Log::info('Status updated successfully', [
                'concern_id' => $id,
                'new_status' => $concern->status
            ]);

            return response()->json([
                'message' => 'Status updated successfully.',
                'concern' => $concern
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error', ['errors' => $e->errors()]);
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('Update status error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Could not update the status. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateFeedback(Request $request, $id)
    {
        try {
            // Find the concern by ID
            $concern = Concern::find($id);
            
            if (!$concern) {
                return response()->json([
                    'message' => 'Concern not found.'
                ], 404);
            }

            // Validate the request
            $validated = $request->validate([
                'feedback' => 'nullable|string',
            ]);

            // Update the feedback
            $concern->feedback = $validated['feedback'] ?? null;
            $concern->save();

            return response()->json([
                'message' => 'Feedback updated successfully.',
                'concern' => $concern
            ], 200);

        } catch (\Exception $e) {
            Log::error('Update feedback error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Could not update the feedback. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
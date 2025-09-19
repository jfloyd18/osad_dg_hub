<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Concern;
use Illuminate\Http\Request;

class ConcernApiController extends Controller
{
    public function updateStatus(Request $request, Concern $concern)
    {
        $request->validate([
            'status' => 'required|in:Pending,On Progress,Resolved,Rejected',
        ]);

        $concern->status = $request->status;
        $concern->save();

        return response()->json(['message' => 'Status updated successfully.']);
    }

    public function updateFeedback(Request $request, Concern $concern)
    {
        $request->validate([
            'feedback' => 'nullable|string',
        ]);

        $concern->feedback = $request->feedback;
        $concern->save();

        return response()->json(['message' => 'Feedback updated successfully.']);
    }
}
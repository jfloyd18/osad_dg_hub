<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\BookingRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;

class FacilityAvailabilityController extends Controller
{
    /**
     * Check availability of all facilities for a given time range
     */
    public function checkAvailability(Request $request)
    {
        $validated = $request->validate([
            'event_start_date' => 'required|date_format:Y-m-d',
            'event_start_time' => 'required|date_format:H:i',
            'event_end_date' => 'required|date_format:Y-m-d',
            'event_end_time' => 'required|date_format:H:i',
        ]);

        try {
            // Parse the requested time range
            $requestStart = Carbon::parse($validated['event_start_date'] . ' ' . $validated['event_start_time']);
            $requestEnd = Carbon::parse($validated['event_end_date'] . ' ' . $validated['event_end_time']);

            // Validate that end time is after start time
            if ($requestEnd->lte($requestStart)) {
                return response()->json([
                    'error' => 'Event end time must be after start time'
                ], 422);
            }

            // Get all facilities
            $facilities = Facility::all();
            $availability = [];

            foreach ($facilities as $facility) {
                // Find conflicting approved bookings
                $conflicts = BookingRequest::where('facility_id', $facility->id)
                    ->where('status', 'Approved')
                    ->where(function ($query) use ($requestStart, $requestEnd) {
                        $query->where(function ($q) use ($requestStart, $requestEnd) {
                            // Case 1: Existing booking starts during requested time
                            $q->whereBetween('event_start', [$requestStart, $requestEnd]);
                        })->orWhere(function ($q) use ($requestStart, $requestEnd) {
                            // Case 2: Existing booking ends during requested time
                            $q->whereBetween('event_end', [$requestStart, $requestEnd]);
                        })->orWhere(function ($q) use ($requestStart, $requestEnd) {
                            // Case 3: Existing booking completely encompasses requested time
                            $q->where('event_start', '<=', $requestStart)
                              ->where('event_end', '>=', $requestEnd);
                        });
                    })
                    ->get()
                    ->map(function ($booking) {
                        return [
                            'event_name' => $booking->event_name,
                            'start_time' => $booking->event_start->toISOString(),
                            'end_time' => $booking->event_end->toISOString(),
                            'organization' => $booking->organization,
                        ];
                    });

                $availability[$facility->id] = [
                    'facility_id' => $facility->id,
                    'facility_name' => $facility->name,
                    'capacity' => $facility->capacity,
                    'is_available' => $conflicts->isEmpty(),
                    'conflicting_bookings' => $conflicts->isEmpty() ? null : $conflicts,
                ];
            }

            return response()->json([
                'availability' => $availability,
                'requested_time' => [
                    'start' => $requestStart->toISOString(),
                    'end' => $requestEnd->toISOString(),
                ],
            ]);

        } catch (\Exception $e) {
            \Log::error('Availability check error: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while checking availability',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check availability for a specific facility
     */
    public function checkFacilityAvailability(Request $request, $facilityId)
    {
        $validated = $request->validate([
            'event_start_date' => 'required|date_format:Y-m-d',
            'event_start_time' => 'required|date_format:H:i',
            'event_end_date' => 'required|date_format:Y-m-d',
            'event_end_time' => 'required|date_format:H:i',
        ]);

        try {
            $facility = Facility::findOrFail($facilityId);

            // Parse the requested time range
            $requestStart = Carbon::parse($validated['event_start_date'] . ' ' . $validated['event_start_time']);
            $requestEnd = Carbon::parse($validated['event_end_date'] . ' ' . $validated['event_end_time']);

            // Validate that end time is after start time
            if ($requestEnd->lte($requestStart)) {
                return response()->json([
                    'error' => 'Event end time must be after start time'
                ], 422);
            }

            // Find conflicting approved bookings
            $conflicts = BookingRequest::where('facility_id', $facilityId)
                ->where('status', 'Approved')
                ->where(function ($query) use ($requestStart, $requestEnd) {
                    $query->where(function ($q) use ($requestStart, $requestEnd) {
                        $q->whereBetween('event_start', [$requestStart, $requestEnd]);
                    })->orWhere(function ($q) use ($requestStart, $requestEnd) {
                        $q->whereBetween('event_end', [$requestStart, $requestEnd]);
                    })->orWhere(function ($q) use ($requestStart, $requestEnd) {
                        $q->where('event_start', '<=', $requestStart)
                          ->where('event_end', '>=', $requestEnd);
                    });
                })
                ->get()
                ->map(function ($booking) {
                    return [
                        'event_name' => $booking->event_name,
                        'start_time' => $booking->event_start->toISOString(),
                        'end_time' => $booking->event_end->toISOString(),
                        'organization' => $booking->organization,
                    ];
                });

            return response()->json([
                'facility_id' => $facility->id,
                'facility_name' => $facility->name,
                'capacity' => $facility->capacity,
                'is_available' => $conflicts->isEmpty(),
                'conflicting_bookings' => $conflicts->isEmpty() ? null : $conflicts,
                'requested_time' => [
                    'start' => $requestStart->toISOString(),
                    'end' => $requestEnd->toISOString(),
                ],
            ]);

        } catch (\Exception $e) {
            \Log::error('Facility availability check error: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while checking availability',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
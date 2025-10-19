<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Facility;
use App\Models\BookingRequest;
use Carbon\Carbon;

class RoomManagementController extends Controller
{
    public function index()
    {
        $now = Carbon::now();

        // Get all rooms (301-307, 401-407, 501-507)
        $rooms = collect();
        foreach ([3, 4, 5] as $floor) {
            for ($roomNum = 1; $roomNum <= 7; $roomNum++) {
                $roomNumber = ($floor * 100) + $roomNum;
                
                // Find the facility in database
                $facility = Facility::where('name', (string)$roomNumber)
                    ->orWhere('name', 'Room ' . $roomNumber)
                    ->first();
                    
                if ($facility) {
                    // Check if there's an active booking
                    $currentBooking = BookingRequest::where('facility_id', $facility->id)
                        ->where('status', 'Approved')
                        ->where('event_start', '<=', $now)
                        ->where('event_end', '>=', $now)
                        ->first();
                    
                    // Get upcoming bookings (approved only, starting from now)
                    $upcomingBookings = BookingRequest::where('facility_id', $facility->id)
                        ->where('status', 'Approved')
                        ->where('event_start', '>', $now)
                        ->orderBy('event_start', 'asc')
                        ->get()
                        ->map(function ($booking) {
                            return [
                                'id' => $booking->id,
                                'event_name' => $booking->event_name,
                                'start_time' => $booking->event_start,
                                'end_time' => $booking->event_end,
                                'organization' => $booking->organization,
                                'department' => $booking->department,
                                'estimated_people' => $booking->estimated_people,
                                'purpose' => $booking->purpose,
                                'status' => 'approved',
                            ];
                        });
                    
                    $rooms->push([
                        'id' => $facility->id,
                        'room_number' => (string)$roomNumber,
                        'floor' => $floor,
                        'status' => $currentBooking ? 'Occupied' : 'Available',
                        'current_booking' => $currentBooking ? [
                            'event_name' => $currentBooking->event_name,
                            'start_time' => $currentBooking->event_start,
                            'end_time' => $currentBooking->event_end,
                        ] : null,
                        'upcoming_bookings' => $upcomingBookings,
                    ]);
                } else {
                    // If facility doesn't exist in DB, show as unavailable
                    $rooms->push([
                        'id' => null,
                        'room_number' => (string)$roomNumber,
                        'floor' => $floor,
                        'status' => 'Maintenance',
                        'current_booking' => null,
                        'upcoming_bookings' => [],
                    ]);
                }
            }
        }

        // Get venues (Auditorium, Lobby, Quadrangle)
        $venueNames = ['Auditorium', 'Lobby', 'Quadrangle'];
        $venues = collect();

        foreach ($venueNames as $venueName) {
            $facility = Facility::where('name', $venueName)->first();
            
            if ($facility) {
                // Check if there's an active booking
                $currentBooking = BookingRequest::where('facility_id', $facility->id)
                    ->where('status', 'Approved')
                    ->where('event_start', '<=', $now)
                    ->where('event_end', '>=', $now)
                    ->first();
                
                // Get upcoming bookings
                $upcomingBookings = BookingRequest::where('facility_id', $facility->id)
                    ->where('status', 'Approved')
                    ->where('event_start', '>', $now)
                    ->orderBy('event_start', 'asc')
                    ->get()
                    ->map(function ($booking) {
                        return [
                            'id' => $booking->id,
                            'event_name' => $booking->event_name,
                            'start_time' => $booking->event_start,
                            'end_time' => $booking->event_end,
                            'organization' => $booking->organization,
                            'department' => $booking->department,
                            'estimated_people' => $booking->estimated_people,
                            'purpose' => $booking->purpose,
                            'status' => 'approved',
                        ];
                    });
                
                $venues->push([
                    'id' => $facility->id,
                    'name' => $facility->name,
                    'status' => $currentBooking ? 'Occupied' : 'Available',
                    'capacity' => $facility->capacity ?? 50,
                    'current_booking' => $currentBooking ? [
                        'event_name' => $currentBooking->event_name,
                        'start_time' => $currentBooking->event_start,
                        'end_time' => $currentBooking->event_end,
                    ] : null,
                    'upcoming_bookings' => $upcomingBookings,
                ]);
            } else {
                // If venue doesn't exist in DB, show placeholder
                $venues->push([
                    'id' => null,
                    'name' => $venueName,
                    'status' => 'Maintenance',
                    'capacity' => 0,
                    'current_booking' => null,
                    'upcoming_bookings' => [],
                ]);
            }
        }

        return Inertia::render('Admin/FacilityBooking/RoomManagement', [
            'rooms' => $rooms->values(),
            'venues' => $venues->values(),
        ]);
    }
    
    /**
     * Get booking details for a specific facility
     */
    public function getFacilityBookings($facilityId)
    {
        $now = Carbon::now();
        
        $facility = Facility::findOrFail($facilityId);
        
        // Get upcoming bookings
        $upcomingBookings = BookingRequest::where('facility_id', $facilityId)
            ->where('status', 'Approved')
            ->where('event_start', '>', $now)
            ->orderBy('event_start', 'asc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'event_name' => $booking->event_name,
                    'start_time' => $booking->event_start,
                    'end_time' => $booking->event_end,
                    'organization' => $booking->organization,
                    'department' => $booking->department,
                    'estimated_people' => $booking->estimated_people,
                    'purpose' => $booking->purpose,
                    'status' => 'approved',
                ];
            });
        
        return response()->json([
            'facility' => [
                'id' => $facility->id,
                'name' => $facility->name,
                'capacity' => $facility->capacity,
            ],
            'upcoming_bookings' => $upcomingBookings,
        ]);
    }
}
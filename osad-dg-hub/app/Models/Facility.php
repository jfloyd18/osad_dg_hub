<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Facility extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'facilities';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'capacity',
        'location',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'capacity' => 'integer',
    ];

    /**
     * Get the booking requests for the facility.
     */
    public function bookingRequests(): HasMany
    {
        return $this->hasMany(BookingRequest::class);
    }

    /**
     * Get active/current booking for this facility
     */
    public function currentBooking()
    {
        $now = Carbon::now();
        return $this->bookingRequests()
            ->where('status', 'Approved')
            ->where('event_start', '<=', $now)
            ->where('event_end', '>=', $now)
            ->first();
    }

    /**
     * Check if facility is currently occupied
     */
    public function isOccupied(): bool
    {
        return $this->currentBooking() !== null;
    }

    /**
     * Check if facility is available at a given time
     */
    public function isAvailable($startTime, $endTime): bool
    {
        return !$this->bookingRequests()
            ->where('status', 'Approved')
            ->where(function ($query) use ($startTime, $endTime) {
                $query->whereBetween('event_start', [$startTime, $endTime])
                    ->orWhereBetween('event_end', [$startTime, $endTime])
                    ->orWhere(function ($q) use ($startTime, $endTime) {
                        $q->where('event_start', '<=', $startTime)
                          ->where('event_end', '>=', $endTime);
                    });
            })
            ->exists();
    }

    /**
     * Get upcoming bookings for this facility
     */
    public function upcomingBookings($limit = 5)
    {
        return $this->bookingRequests()
            ->where('status', 'Approved')
            ->where('event_start', '>', Carbon::now())
            ->orderBy('event_start', 'asc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get booking history for this facility
     */
    public function bookingHistory($limit = 10)
    {
        return $this->bookingRequests()
            ->where('event_end', '<', Carbon::now())
            ->orderBy('event_end', 'desc')
            ->limit($limit)
            ->get();
    }
}
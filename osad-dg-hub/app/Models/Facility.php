<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'capacity',
        'location',
    ];

    /**
     * Get the booking requests for the facility.
     */
    public function bookingRequests()
    {
        return $this->hasMany(BookingRequest::class);
    }
}

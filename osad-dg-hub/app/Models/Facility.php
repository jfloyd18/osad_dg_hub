<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'facility_name',
        'facility_id',
        'description',
        'capacity',
        'location',
        'status',
    ];

    /**
     * Get the booking requests for the facility.
     */
    public function bookingRequests()
    {
        return $this->hasMany(BookingRequest::class);
    }
}
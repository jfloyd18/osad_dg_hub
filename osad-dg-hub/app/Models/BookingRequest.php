<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // In app/Models/BookingRequest.php

protected $fillable = [
    'department',
    'organization',
    'contact_no',
    'event_name',
    'facility_id', // <-- Add this line
    'facility_name',
    'estimated_people',
    'event_start',
    'event_end',
    'purpose',
    'user_id',
    'status',
    'submitted_at',
];
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingRequest extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'booking_requests';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'facility_id',
        'facility_name',
        'event_name',
        'event_start',
        'event_end',
        'estimated_people',
        'event_date',
        'start_time',
        'end_time',
        'purpose',
        'department',
        'contact_no',
        'status',
        'feedback',
        'email',
        'email_verified_at',
        'password',
        'remember_token',
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'event_start' => 'datetime',
        'event_end' => 'datetime',
        'event_date' => 'date',
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the facility that owns the booking request.
     */
    public function facility()
    {
        return $this->belongsTo(Facility::class, 'facility_id');
    }

    /**
     * Get the user that owns the booking request.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'department',
        'organization',
        'contact_no',
        'event_name',
        'facility_id',
        'estimated_people',
        'event_start_date',
        'event_start_time',
        'event_end_date',
        'event_end_time',
        'purpose',
        'person_responsible',
        'moderator',
        'activity_plan_path',
        'booking_id',
        'status',
        'feedback',
    ];

    protected $casts = [
        'event_start_date' => 'date',
        'event_end_date' => 'date',
        'estimated_people' => 'integer',
    ];

    // Relationships
    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }

    // Auto-generate booking_id on creation
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->booking_id)) {
                // Get the last booking request
                $lastBooking = static::withTrashed()->orderBy('id', 'desc')->first();
                $nextId = $lastBooking ? $lastBooking->id + 1 : 1;
                $model->booking_id = 'BK-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
            }
        });
    }

    // Accessor for event_start datetime
    public function getEventStartAttribute()
    {
        return $this->event_start_date . ' ' . $this->event_start_time;
    }

    // Accessor for event_end datetime
    public function getEventEndAttribute()
    {
        return $this->event_end_date . ' ' . $this->event_end_time;
    }
}
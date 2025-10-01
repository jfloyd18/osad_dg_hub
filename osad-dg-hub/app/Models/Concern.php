<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Concern extends Model
{
    protected $fillable = [
        'incident_title',
        'details',
        'student_id',
        'reported_by',
        'status',
        'feedback',
        'incident_date',
    ];

    protected $casts = [
        'incident_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'status' => 'string', // Explicitly cast status as string
    ];

    // Define allowed status values
    const STATUS_PENDING = 'Pending';
    const STATUS_ON_PROGRESS = 'On Progress';
    const STATUS_RESOLVED = 'Resolved';
    const STATUS_REJECTED = 'Rejected';

    // Get all allowed statuses
    public static function getAllowedStatuses()
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_ON_PROGRESS,
            self::STATUS_RESOLVED,
            self::STATUS_REJECTED,
        ];
    }
}
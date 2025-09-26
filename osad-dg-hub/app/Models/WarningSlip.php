<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarningSlip extends Model
{
    use HasFactory;

    protected $table = 'warning_slips';

    protected $fillable = [
        'name',
        'student_id',
        'section',
        'current_address',
        'home_address',
        'mobile_no',
        'details',
        'status',
        'violation_type',
        'date_of_violation',
    ];

    protected $casts = [
        'date_of_violation' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Optional: Add any relationships or custom methods here
    public function getStatusBadgeAttribute()
    {
        $badges = [
            'pending' => 'warning',
            'resolved' => 'success',
            'dismissed' => 'secondary',
        ];

        return $badges[$this->status] ?? 'secondary';
    }
}
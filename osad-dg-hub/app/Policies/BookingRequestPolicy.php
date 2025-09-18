<?php

namespace App\Policies;

use App\Models\BookingRequest;
use App\Models\User;

class BookingRequestPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, BookingRequest $bookingRequest): bool
    {
        return $user->id === $bookingRequest->user_id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, BookingRequest $bookingRequest): bool
    {
        // A user can update their request only if they own it AND its status is 'Pending'.
        return $user->id === $bookingRequest->user_id && $bookingRequest->status === 'Pending';
    }
}
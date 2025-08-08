<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OrganizationManagementController;

// The root URL will now render your login page.
Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('login');

// Add a distinct 'home' route.
Route::get('/home', function () {
    return Inertia::render('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // --- Facility Booking Routes ---
    Route::get('/facility-booking/request', function () {
        // This tells Inertia to render the component at:
        // resources/js/pages/FacilityBooking/Request.tsx
        return Inertia::render('FacilityBooking/Request');
    })->name('facility-booking.request');

    Route::get('/facility-booking/overview', function () {
        return Inertia::render('FacilityBooking/Overview');
    })->name('facility-booking.overview');


    Route::get('organization-management', [OrganizationManagementController::class, 'index'])
        ->name('organization-management');

    // --- Placeholder routes for other sidebar links ---
    Route::get('/calendar', function () {
        return Inertia::render('Calendar');
    })->name('calendar');

    Route::get('/student-concern', function () {
        return Inertia::render('StudentConcern');
    })->name('student-concern');
});

// Ensure these files exist and contain your authentication and settings routes.
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

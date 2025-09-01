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
        return Inertia::render('FacilityBooking/Request');
    })->name('facility-booking.request');

    Route::get('/facility-booking/overview', function () {
        return Inertia::render('FacilityBooking/Overview');
    })->name('facility-booking.overview');

    // --- Student Concern Routes ---
    Route::get('/student-concern/overview', function () {
        return Inertia::render('StudentConcern/Overview');
    })->name('student-concern.overview');

    Route::get('/student-concern/lodge', function () {
        // You will need to create a 'StudentConcern/Lodge.tsx' component for this page
        return Inertia::render('StudentConcern/Lodge');
    })->name('student-concern.lodge');


    Route::get('organization-management', [OrganizationManagementController::class, 'index'])
        ->name('organization-management');

    // --- Placeholder route for Calendar ---
    Route::get('/calendar', function () {
        return Inertia::render('Calendar');
    })->name('calendar');

});

// Ensure these files exist and contain your authentication and settings routes.
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

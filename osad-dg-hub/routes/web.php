<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OrganizationManagementController;
use App\Http\Controllers\StudentConcernController;

// The root URL will now render your login page.
Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('login');

// Add a distinct 'home' route.
Route::get('/home', function () {
    return Inertia::render('dashboard');
})->name('home');

// --- ROUTES FOR ALL LOGGED-IN USERS (STUDENTS AND ADMINS) ---
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

    // --- Student Concern Routes (Refactored to use a Controller) ---
    Route::prefix('student-concern')->name('student-concern.')->group(function () {
        Route::get('/overview', [StudentConcernController::class, 'showOverview'])->name('overview');
        
        // This 'lodge' route now renders your 'IncidentReportPage' component
        Route::get('/lodge', [StudentConcernController::class, 'showIncidentReportForm'])->name('lodge'); 
        
        // This 'warnings' route now renders your 'ViewWarningsPage' component
        Route::get('/warnings', [StudentConcernController::class, 'showWarnings'])->name('warnings');
    });

    // The line below was causing the error because the controller does not exist yet.
    // It has been commented out to allow the application to run.
    // Route::get('organization-management', [OrganizationManagementController::class, 'index'])
    //       ->name('organization-management');

    // --- Placeholder route for Calendar ---
    Route::get('/calendar', function () {
        return Inertia::render('Calendar');
    })->name('calendar');
});


// --- ADMIN-ONLY ROUTES ---
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    // All other admin-only routes can go here in the future
    // ADD THIS ROUTE FOR THE NEW PAGE
    Route::get('/admin/booking-overview', function () {
        return Inertia::render('Admin/RequestOverview');
    })->name('admin.booking-overview');
});


// Ensure these files exist and contain your authentication and settings routes.
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
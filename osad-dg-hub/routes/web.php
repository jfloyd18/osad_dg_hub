<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StudentConcernController;
use App\Http\Controllers\Admin\FacilityBookingPageController;
use App\Http\Controllers\Api\AdminBookingController; // <-- 1. IMPORT THE CONTROLLER
use App\Http\Controllers\Api\WarningSlipController;

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
        
        Route::post('/lodge', [StudentConcernController::class, 'store'])->name('store');

        // This 'warnings' route now renders your 'ViewWarningsPage' component
        Route::get('/warnings', [StudentConcernController::class, 'showWarnings'])->name('warnings');

        // --- ADD THESE NEW ROUTES FOR THE STUDENT WARNING SLIP FORM ---
        Route::get('/warning-slip', [StudentConcernController::class, 'showWarningSlipForm'])->name('warning-slip.create');
        Route::post('/warning-slip', [StudentConcernController::class, 'storeWarningSlip'])->name('warning-slip.store');
    
       
    });

    // --- Placeholder route for Calendar ---
    Route::get('/calendar', function () {
        return Inertia::render('Calendar');
    })->name('calendar');
});


// --- ADMIN-ONLY ROUTES (Using inline check instead of middleware) ---
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    
    Route::get('/dashboard', function () {
        // Check if user is admin inline
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('dashboard')->with('error', 'Unauthorized access.');
        }
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    Route::get('/facility-booking/overview', function () {
        // Check if user is admin inline
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('dashboard')->with('error', 'Unauthorized access.');
        }
        
        // Call the controller method
        $controller = new FacilityBookingPageController();
        return $controller->overview();
    })->name('facility-booking.overview');
    
    // --- FIX IS HERE: ADDED THE MISSING PATCH ROUTE ---
    // 2. This route handles the PATCH request to update the booking status.
    Route::patch('/booking-requests/{bookingRequest}/status', [AdminBookingController::class, 'updateStatus'])
         ->name('booking-requests.updateStatus');
    
});


// Ensure these files exist and contain your authentication and settings routes.
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
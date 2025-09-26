<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StudentConcernController;
use App\Http\Controllers\Admin\FacilityBookingPageController;
use App\Http\Controllers\Api\AdminBookingController;
use App\Http\Controllers\BookingRequestController;
use App\Http\Controllers\Admin\WarningSlipController;
use App\Http\Controllers\Admin\ConcernController;

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
    
    Route::post('/facility-booking/request', [BookingRequestController::class, 'store'])->name('facility-booking.request.store');
    Route::get('/facility-booking/overview', [BookingRequestController::class, 'index'])->name('facility-booking.overview');
    Route::get('/facility-booking/requests/{bookingRequest}', [BookingRequestController::class, 'show'])->name('facility-booking.show');
    Route::put('/facility-booking/requests/{bookingRequest}', [BookingRequestController::class, 'update'])->name('facility-booking.update');


    // --- Student Concern Routes (Refactored to use a Controller) ---
    Route::prefix('student-concern')->name('student-concern.')->group(function () {
        Route::get('/overview', [StudentConcernController::class, 'showOverview'])->name('overview');
        
        Route::get('/lodge', [StudentConcernController::class, 'showIncidentReportForm'])->name('lodge'); 
        
        // The store route for incident reports was missing, adding it back.
        // If you don't have a store method in StudentConcernController, you can remove this line.
        // Route::post('/lodge', [StudentConcernController::class, 'store'])->name('store');

        Route::get('/warnings', [StudentConcernController::class, 'showWarnings'])->name('warnings');
    });

    // --- Placeholder route for Calendar ---
    Route::get('/calendar', function () {
        return Inertia::render('Calendar');
    })->name('calendar');
});


// --- ADMIN-ONLY ROUTES (Using inline check instead of middleware) ---
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    
    Route::get('/dashboard', function () {
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('dashboard')->with('error', 'Unauthorized access.');
        }
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    Route::get('/facility-booking/overview', function () {
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('dashboard')->with('error', 'Unauthorized access.');
        }
        $controller = new FacilityBookingPageController();
        return $controller->overview();
    })->name('facility-booking.overview');
    
    Route::patch('/booking-requests/{bookingRequest}/status', [AdminBookingController::class, 'updateStatus'])
        ->name('booking-requests.updateStatus');

    // --- ADMIN STUDENT CONCERN ROUTES ---
    // The main admin concern overview is managed by the ConcernController.
    Route::get('/student-concern/overview', [ConcernController::class, 'index'])->name('concerns.overview');

    // The new route to show a single, specific concern.
    Route::get('/concerns/{concern}', [ConcernController::class, 'show'])->name('concerns.show');

    // The routes for creating and storing a warning slip.
    Route::get('/warning-slip', [WarningSlipController::class, 'create'])->name('warning-slip.create');
    Route::post('/warning-slip', [WarningSlipController::class, 'store'])->name('warning-slip.store');
    
    // The route for the Warning Slip Overview page.
    Route::get('/warnings/overview', [WarningSlipController::class, 'overview'])->name('warnings.overview');

    // The new route to show a single, specific warning slip.
    Route::get('/warnings/{warningSlip}', [WarningSlipController::class, 'show'])->name('warnings.show');
    
});


// Ensure these files exist and contain your authentication and settings routes.
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';


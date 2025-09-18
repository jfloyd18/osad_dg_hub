<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminBookingController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\BookingRequestController;
use App\Http\Controllers\Api\ConcernController;
use App\Http\Controllers\Api\WarningSlipController;
use App\Http\Controllers\Api\OrganizationController;

// --- Authenticated user endpoint (leave as-is) ---
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// --- USER ROUTES (Temporarily Public for Testing) ---
Route::get('/stats', [BookingRequestController::class, 'stats']);
Route::get('/requests', [BookingRequestController::class, 'index']);
Route::post('/requests', [BookingRequestController::class, 'store']);
Route::get('/facilities/most-booked', [BookingRequestController::class, 'mostBooked']);
Route::get('/facilities', [\App\Http\Controllers\Api\FacilityController::class, 'index']);
Route::get('/organizations', [OrganizationController::class, 'index']); 

// --- ADMIN API ROUTES (Temporarily Public for Testing) ---
Route::get('/admin/dashboard-data', [AdminDashboardController::class, 'getData']);
Route::get('/admin/booking-requests', [AdminBookingController::class, 'index']);
Route::patch('/admin/booking-requests/{bookingRequest}/status', [AdminBookingController::class, 'updateStatus']);
Route::get('/concerns/overview', [ConcernController::class, 'overview']);


// --- FIX IS HERE: The POST route is now public ---
Route::post('/concerns/create', [ConcernController::class, 'store']);


// --- Protected routes (require login) ---
Route::middleware('auth:sanctum')->group(function () {

    // USER-SPECIFIC FACILITY BOOKING ROUTES have been moved above to be temporarily public.
    
    // --- USER-SPECIFIC STUDENT CONCERN ROUTES ---
    Route::prefix('concerns')->group(function () {
        // The POST /create route has been moved out of this group to be public
    });

    // --- USER-SPECIFIC WARNING SLIP ROUTES ---
    Route::prefix('warnings')->group(function () {
        Route::get('/', [WarningSlipController::class, 'index']);
        Route::post('/create', [WarningSlipController::class, 'store']);
    });
});
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookingRequestController;
use App\Http\Controllers\Api\ConcernController;
use App\Http\Controllers\Api\WarningSlipController;

// --- Authenticated user endpoint (leave as-is) ---
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// --- Public routes (no auth required) ---
Route::get('/stats', [BookingRequestController::class, 'stats']);
Route::get('/facilities', [BookingRequestController::class, 'facilities']);
Route::get('/facilities/most-booked', [BookingRequestController::class, 'mostBooked']);
Route::post('/requests', [BookingRequestController::class, 'store']);
Route::get('/requests', [BookingRequestController::class, 'index']);

// --- TEMPORARILY PUBLIC ROUTES FOR TESTING ---
Route::get('/concerns/overview', [ConcernController::class, 'overview']);
Route::post('/concerns/create', [ConcernController::class, 'store']); // Moved for testing
Route::get('/warnings', [WarningSlipController::class, 'index']);
// --- END OF TEMPORARY ROUTES ---


// --- Protected routes (require login) ---
Route::middleware('auth:sanctum')->group(function () {
    // Student Concern and Concern Overview API Routes
    Route::prefix('concerns')->group(function () {
        // MOVED: Route::get('/overview', [ConcernController::class, 'overview']);
        // MOVED: Route::post('/create', [ConcernController::class, 'store']);
    });

    // Warning Slip API Routes
    Route::prefix('warnings')->group(function () {
        // MOVED: Route::get('/', [WarningSlipController::class, 'index']);
        Route::post('/create', [WarningSlipController::class, 'store']);
    });
});
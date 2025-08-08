<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// This route is public for testing
Route::get('/', function () {
    return Inertia::render('dashboard');
})->name('home');

// This route is also public for testing
Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->name('dashboard');

Route::get('/facility-booking/request', function () {
    return Inertia::render('FacilityBooking/Request');
})->middleware(['auth', 'verified'])->name('facility-booking.request');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/facility-booking/request', function () {
        return Inertia::render('RequestFacility');
    })->name('facility-booking.request');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
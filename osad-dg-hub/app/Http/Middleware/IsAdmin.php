<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        // First, check if the user is authenticated
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            // If not an admin, return a 403 Forbidden error
            return response()->json(['message' => 'Unauthorized Access.'], 403);
        }

        // If the user is an admin, continue with the request
        return $next($request);
    }
}
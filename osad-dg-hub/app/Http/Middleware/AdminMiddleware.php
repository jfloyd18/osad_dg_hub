<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if user is authenticated and is an admin
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            // If it's an API request, return JSON response
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
            }
            
            // Otherwise redirect to dashboard with error message
            return redirect()->route('dashboard')->with('error', 'You do not have admin access.');
        }

        return $next($request);
    }
}
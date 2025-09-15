<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is logged in and is an admin
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            // If not, block access.
            abort(403, 'Unauthorized Action.');
        }

        // If they are an admin, let them proceed.
        return $next($request);
    }
}
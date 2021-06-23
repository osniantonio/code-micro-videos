<?php

namespace App\Http\Middleware;

use Closure;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $origins = env('CORS_ORIGINS', []);
        return $next($request)
            ->header('Access-Control-Allow-Origin', is_string($origins) ? explode(",", $origins) : $origins)
            ->header('Access-Control-Allow-Methods', '*')
            ->header('Access-Control-Allow-Headers', '*');
    }
}
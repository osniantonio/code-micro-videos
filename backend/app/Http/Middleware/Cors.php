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
        //header('Access-Control-Allow-Origin:  *');
        $origins = env('CORS_ORIGINS', []);
        $response = $next($request);
        $response->header('Access-Control-Allow-Origin', is_string($origins) ? explode(",", $origins) : $origins);
        $response->header('Access-Control-Allow-Methods', 'HEAD, GET, PUT, PATCH, POST');
        return $response;
    }
}

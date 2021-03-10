<?php

$origins = env('CORS_ORIGINS', []);

return [
    'supportsCredentials' => false,
    'allowedOrigins' => is_string($origins) ? explode(",", $origins) : $origins,
    'allowedOriginsPatterns' => [],
    'allowedHeaders' => ['*'],
    'allowedMethods' => ['*'],
    'exposedHeaders' => [],
    'maxAge' => 0,
];

<?php

$origins = env('CORS_ORIGINS', []);

return [
    'paths' => ['*'],
    'supportsCredentials' => false,
    'allowedOrigins' => '*',
    'allowedOriginsPatterns' => [],
    'allowedHeaders' => ['*'],
    'allowedMethods' => ['*'],
    'exposedHeaders' => [],
    'maxAge' => 0,
];

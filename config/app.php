<?php

declare(strict_types=1);
return [
    'app' => [
        'name' => 'Rick & Morty Character Explorer',
        'env' => $_ENV['APP_ENV'] ?? 'development',
        'debug' => (bool) ($_ENV['APP_DEBUG'] ?? true),
        'url' => $_ENV['APP_URL'] ?? 'http://localhost:8080',
    ],
    'api' => [
        'base_url' => 'https://rickandmortyapi.com/api',
        'timeout' => 10,
        'cache_ttl' => 3600,
    ],
    'paths' => [
        'root' => dirname(__DIR__),
        'app' => dirname(__DIR__) . '/app',
        'config' => __DIR__,
        'public' => dirname(__DIR__) . '/public',
        'storage' => dirname(__DIR__) . '/storage',
        'cache' => dirname(__DIR__) . '/storage/cache',
        'logs' => dirname(__DIR__) . '/storage/logs',
        'views' => dirname(__DIR__) . '/app/Views',
        'database' => dirname(__DIR__) . '/database',
    ],

    'database' => [
        'driver' => 'sqlite',
        'path' => dirname(__DIR__) . '/database/rickmorty.sqlite',
    ],

    'view' => [
        'cache' => false,
    ],
];
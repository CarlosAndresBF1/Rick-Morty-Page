<?php

declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('BASE_PATH', dirname(__DIR__));
spl_autoload_register(function (string $class): void {
    // Convert namespace to file path
    // App\Controllers\HomeController -> app/Controllers/HomeController.php
    $prefix = 'App\\';
    $baseDir = BASE_PATH . '/app/';

    // Check if class uses our namespace prefix
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    // Get the relative class name
    $relativeClass = substr($class, $len);

    // Convert namespace separators to directory separators
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    // Require the file if it exists
    if (file_exists($file)) {
        require $file;
    }
});

// Load configuration
$config = require BASE_PATH . '/config/app.php';

// Make config globally accessible
$GLOBALS['config'] = $config;

/**
 * Get configuration value
 * 
 * @param string $key Dot notation key (e.g., 'app.name')
 * @param mixed $default Default value if key not found
 * @return mixed
 */
function config(string $key, mixed $default = null): mixed
{
    $config = $GLOBALS['config'];
    $keys = explode('.', $key);

    foreach ($keys as $k) {
        if (!isset($config[$k])) {
            return $default;
        }
        $config = $config[$k];
    }

    return $config;
}

/**
 * Get base path
 * 
 * @param string $path Additional path to append
 * @return string
 */
function basePath(string $path = ''): string
{
    return BASE_PATH . ($path ? '/' . ltrim($path, '/') : '');
}

/**
 * Get public path
 * 
 * @param string $path Additional path to append
 * @return string
 */
function publicPath(string $path = ''): string
{
    return config('paths.public') . ($path ? '/' . ltrim($path, '/') : '');
}

/**
 * Get storage path
 * 
 * @param string $path Additional path to append
 * @return string
 */
function storagePath(string $path = ''): string
{
    return config('paths.storage') . ($path ? '/' . ltrim($path, '/') : '');
}

/**
 * Generate URL for asset
 * 
 * @param string $path Asset path
 * @return string
 */
function asset(string $path): string
{
    return '/assets/' . ltrim($path, '/');
}

/**
 * Generate URL
 * 
 * @param string $path URL path
 * @return string
 */
function url(string $path = ''): string
{
    return config('app.url') . '/' . ltrim($path, '/');
}

/**
 * Escape HTML
 * 
 * @param string|null $value Value to escape
 * @return string
 */
function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Dump and die (debug helper)
 * 
 * @param mixed ...$vars Variables to dump
 * @return never
 */
function dd(mixed ...$vars): never
{
    echo '<pre style="background:#1e1e1e;color:#d4d4d4;padding:20px;margin:20px;border-radius:8px;overflow:auto;">';
    foreach ($vars as $var) {
        var_dump($var);
    }
    echo '</pre>';
    exit;
}
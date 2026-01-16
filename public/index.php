<?php

declare(strict_types=1);
define('APP_START', microtime(true)); // Verificacion de rendimiento
require dirname(__DIR__) . '/app/bootstrap.php';
$routes = require BASE_PATH . '/config/routes.php';

$router = new App\Core\Router();
$router->addRoutes($routes);

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

try {
    $response = $router->dispatch($method, $uri);
    echo $response;
} catch (Throwable $e) {
    if (config('app.debug')) {
        http_response_code(500);
        echo '<div style="font-family: monospace; padding: 20px; background: #fee; border: 1px solid #f00; margin: 20px; border-radius: 8px;">';
        echo '<h1 style="color: #c00;">Error</h1>';
        echo '<p><strong>Message:</strong> ' . htmlspecialchars($e->getMessage()) . '</p>';
        echo '<p><strong>File:</strong> ' . htmlspecialchars($e->getFile()) . ':' . $e->getLine() . '</p>';
        echo '<pre style="background: #333; color: #fff; padding: 10px; overflow: auto; border-radius: 4px;">' . htmlspecialchars($e->getTraceAsString()) . '</pre>';
        echo '</div>';
    } else {
        http_response_code(500);
        echo App\Core\View::render('errors/500');
    }
}
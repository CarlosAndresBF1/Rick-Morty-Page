<?php

declare(strict_types=1);

namespace App\Core;

class Router
{
    /**
     * @var array<string, array{0: string, 1: string}> Route definitions
     */
    private array $routes = [];

    /**
     * @var array<string, mixed> Route parameters
     */
    private array $params = [];

    /**
     * Add routes from configuration
     * 
     * @param array<string, array{0: string, 1: string}> $routes
     * @return void
     */
    public function addRoutes(array $routes): void
    {
        foreach ($routes as $route => $handler) {
            $this->routes[$route] = $handler;
        }
    }

    /**
     * Match the current request to a route
     * 
     * @param string $method HTTP method
     * @param string $uri Request URI
     * @return array{controller: string, action: string, params: array<string, mixed>}|null
     */
    public function match(string $method, string $uri): ?array
    {
        // Remove query string
        $uri = parse_url($uri, PHP_URL_PATH) ?: '/';

        // Normalize URI
        $uri = '/' . trim($uri, '/');
        if ($uri !== '/') {
            $uri = rtrim($uri, '/');
        }

        foreach ($this->routes as $route => $handler) {
            // Parse route definition (e.g., "GET /characters/{id}")
            [$routeMethod, $routePath] = explode(' ', $route, 2);

            // Check method
            if ($routeMethod !== $method) {
                continue;
            }

            // Convert route pattern to regex
            $pattern = $this->convertToRegex($routePath);

            // Try to match
            if (preg_match($pattern, $uri, $matches)) {
                // Extract named parameters
                $params = array_filter(
                    $matches,
                    fn($key) => is_string($key),
                    ARRAY_FILTER_USE_KEY
                );

                return [
                    'controller' => $handler[0],
                    'action' => $handler[1],
                    'params' => $params,
                ];
            }
        }

        return null;
    }

    /**
     * Convert route pattern to regex
     * 
     * @param string $route Route pattern (e.g., "/characters/{id}")
     * @return string Regex pattern
     */
    private function convertToRegex(string $route): string
    {
        // Escape forward slashes
        $pattern = str_replace('/', '\/', $route);

        // Convert {param} to named capture groups
        $pattern = preg_replace(
            '/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/',
            '(?P<$1>[^\/]+)',
            $pattern
        );

        return '/^' . $pattern . '$/';
    }

    /**
     * Dispatch the request to the appropriate controller
     * 
     * @param string $method HTTP method
     * @param string $uri Request URI
     * @return mixed
     */
    public function dispatch(string $method, string $uri): mixed
    {
        $match = $this->match($method, $uri);

        if ($match === null) {
            http_response_code(404);
            return $this->handleNotFound();
        }

        $controllerClass = $match['controller'];
        $action = $match['action'];
        $params = $match['params'];

        // Check if controller class exists
        if (!class_exists($controllerClass)) {
            throw new \RuntimeException("Controller not found: {$controllerClass}");
        }

        // Create controller instance
        $controller = new $controllerClass();

        // Check if action method exists
        if (!method_exists($controller, $action)) {
            throw new \RuntimeException("Action not found: {$controllerClass}::{$action}");
        }

        // Call the action with parameters
        return $controller->$action(...array_values($params));
    }

    /**
     * Handle 404 Not Found
     * 
     * @return string
     */
    private function handleNotFound(): string
    {
        return View::render('errors/404');
    }
}
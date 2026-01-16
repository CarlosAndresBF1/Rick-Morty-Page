<?php

declare(strict_types=1);

namespace App\Core;

abstract class Controller
{
    /**
     * Render a view
     * 
     * @param string $view View name
     * @param array<string, mixed> $data Data to pass to the view
     * @return string
     */
    protected function view(string $view, array $data = []): string
    {
        return View::render($view, $data);
    }

    /**
     * Render a partial view (no layout)
     * 
     * @param string $view View name
     * @param array<string, mixed> $data Data to pass to the view
     * @return string
     */
    protected function partial(string $view, array $data = []): string
    {
        return View::partial($view, $data);
    }

    /**
     * Return JSON response
     * 
     * @param mixed $data Data to encode
     * @param int $statusCode HTTP status code
     * @return string
     */
    protected function json(mixed $data, int $statusCode = 200): string
    {
        return View::json($data, $statusCode);
    }

    /**
     * Redirect to another URL
     * 
     * @param string $url URL to redirect to
     * @param int $statusCode HTTP status code (302 or 301)
     * @return never
     */
    protected function redirect(string $url, int $statusCode = 302): never
    {
        http_response_code($statusCode);
        header("Location: {$url}");
        exit;
    }

    /**
     * Get query parameter
     * 
     * @param string $key Parameter name
     * @param mixed $default Default value
     * @return mixed
     */
    protected function query(string $key, mixed $default = null): mixed
    {
        return $_GET[$key] ?? $default;
    }

    /**
     * Get POST data
     * 
     * @param string|null $key Parameter name (null to get all)
     * @param mixed $default Default value
     * @return mixed
     */
    protected function input(?string $key = null, mixed $default = null): mixed
    {
        if ($key === null) {
            return $_POST;
        }
        return $_POST[$key] ?? $default;
    }

    /**
     * Get JSON body data
     * 
     * @return array<string, mixed>
     */
    protected function jsonBody(): array
    {
        $body = file_get_contents('php://input');
        return json_decode($body, true) ?? [];
    }

    /**
     * Check if request is AJAX
     * 
     * @return bool
     */
    protected function isAjax(): bool
    {
        return !empty($_SERVER['HTTP_X_REQUESTED_WITH'])
            && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }

    /**
     * Check if request expects JSON
     * 
     * @return bool
     */
    protected function wantsJson(): bool
    {
        $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
        return str_contains($accept, 'application/json');
    }
}
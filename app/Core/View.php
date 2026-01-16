<?php

declare(strict_types=1);

namespace App\Core;

class View
{
    /**
     * @var string|null Current layout
     */
    private static ?string $layout = 'layouts/main';

    /**
     * @var array<string, mixed> Shared data for all views
     */
    private static array $shared = [];

    /**
     * Set the layout to use
     * 
     * @param string|null $layout Layout name or null to disable
     * @return void
     */
    public static function setLayout(?string $layout): void
    {
        self::$layout = $layout;
    }

    /**
     * Share data with all views
     * 
     * @param string $key Data key
     * @param mixed $value Data value
     * @return void
     */
    public static function share(string $key, mixed $value): void
    {
        self::$shared[$key] = $value;
    }

    /**
     * Render a view template
     * 
     * @param string $view View name (e.g., 'characters/index')
     * @param array<string, mixed> $data Data to pass to the view
     * @return string Rendered HTML
     */
    public static function render(string $view, array $data = []): string
    {
        // Merge shared data with view data
        $data = array_merge(self::$shared, $data);

        // Render the view content
        $content = self::renderTemplate($view, $data);

        // If a layout is set, wrap content in layout
        if (self::$layout !== null) {
            $data['content'] = $content;
            return self::renderTemplate(self::$layout, $data);
        }

        return $content;
    }

    /**
     * Render a partial (no layout)
     * 
     * @param string $view View name
     * @param array<string, mixed> $data Data to pass to the view
     * @return string Rendered HTML
     */
    public static function partial(string $view, array $data = []): string
    {
        return self::renderTemplate($view, array_merge(self::$shared, $data));
    }

    /**
     * Render a template file
     * 
     * @param string $view View name
     * @param array<string, mixed> $data Data to pass to the view
     * @return string Rendered HTML
     * @throws \RuntimeException If view file not found
     */
    private static function renderTemplate(string $view, array $data): string
    {
        $viewPath = config('paths.views') . '/' . $view . '.php';

        if (!file_exists($viewPath)) {
            throw new \RuntimeException("View not found: {$view} (looked in {$viewPath})");
        }

        // Extract data to make it available as variables
        extract($data);

        // Start output buffering
        ob_start();

        // Include the view file
        include $viewPath;

        // Get the buffered content and clean the buffer
        return ob_get_clean() ?: '';
    }

    /**
     * Render JSON response
     * 
     * @param mixed $data Data to encode
     * @param int $statusCode HTTP status code
     * @return string JSON string
     */
    public static function json(mixed $data, int $statusCode = 200): string
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');

        // Disable layout for JSON responses
        self::$layout = null;

        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) ?: '{}';
    }
}
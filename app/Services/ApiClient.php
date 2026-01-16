<?php

declare(strict_types=1);

namespace App\Services;

class ApiClient
{
    private string $baseUrl;
    private int $timeout;

    public function __construct(string $baseUrl, int $timeout = 10)
    {
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->timeout = $timeout;
    }

    public function get(string $endpoint, array $params = []): array
    {
        $url = $this->baseUrl . '/' . ltrim($endpoint, '/');

        if (!empty($params)) {
            $url .= '?' . http_build_query($params);
        }

        return $this->request('GET', $url);
    }

    private function request(string $method, string $url): array
    {
        $context = stream_context_create([
            'http' => [
                'method' => $method,
                'header' => [
                    'Accept: application/json',
                    'Content-Type: application/json',
                ],
                'timeout' => $this->timeout,
                'ignore_errors' => true,
            ],
        ]);

        $response = @file_get_contents($url, false, $context);

        if ($response === false) {
            throw new \RuntimeException("Failed to connect to API: {$url}");
        }

        $statusCode = $this->getStatusCode($http_response_header ?? []);
        $data = json_decode($response, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException('Invalid JSON response from API');
        }

        if ($statusCode >= 400) {
            $error = $data['error'] ?? 'Unknown error';
            throw new ApiException($error, $statusCode);
        }

        return $data;
    }

    private function getStatusCode(array $headers): int
    {
        if (empty($headers)) {
            return 0;
        }

        if (preg_match('/HTTP\/\d\.\d\s+(\d+)/', $headers[0], $matches)) {
            return (int) $matches[1];
        }

        return 0;
    }
}

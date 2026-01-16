<?php

declare(strict_types=1);

use App\Controllers\HomeController;
use App\Controllers\CharacterController;

return [
    // Home
    'GET /' => [HomeController::class, 'index'],

    // Characters
    'GET /characters' => [CharacterController::class, 'index'],
    'GET /characters/{id}' => [CharacterController::class, 'show'],

    // API endpoints (for AJAX calls)
    'GET /api/characters' => [CharacterController::class, 'list'],
    'GET /api/characters/{id}' => [CharacterController::class, 'detail'],
    'DELETE /api/characters/{id}' => [CharacterController::class, 'delete'],
    'POST /api/characters/{id}/restore' => [CharacterController::class, 'restore'],

    // Starred/Favorites API
    'GET /api/starred' => [CharacterController::class, 'getStarred'],
    'POST /api/characters/{id}/star' => [CharacterController::class, 'toggleStar'],

    // Deleted characters API
    'GET /api/deleted' => [CharacterController::class, 'getDeleted'],
];

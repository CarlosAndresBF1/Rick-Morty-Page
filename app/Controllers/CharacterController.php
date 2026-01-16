<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;


class CharacterController extends Controller
{
    /**
     * Display characters page (main view)
     * 
     * @return string
     */
    public function index(): string
    {
        // Get query parameters for filtering
        $filters = [
            'name' => $this->query('name', ''),
            'status' => $this->query('status', ''),
            'species' => $this->query('species', ''),
            'page' => (int) $this->query('page', 1),
        ];

        return $this->view('characters/index', [
            'title' => 'Rick & Morty Characters',
            'filters' => $filters,
        ]);
    }

    /**
     * Display single character detail page
     * 
     * @param string $id Character ID
     * @return string
     */
    public function show(string $id): string
    {
        return $this->view('characters/show', [
            'title' => 'Character Detail',
            'characterId' => (int) $id,
        ]);
    }

    /**
     * API: List characters (JSON)
     * 
     * @return string
     */
    public function list(): string
    {
        // Get query parameters
        $filters = [
            'name' => $this->query('name', ''),
            'status' => $this->query('status', ''),
            'species' => $this->query('species', ''),
            'page' => (int) $this->query('page', 1),
        ];

        return $this->json([
            'success' => true,
            'message' => 'API endpoint ready.',
            'filters' => $filters,
            'data' => [],
        ]);
    }

    /**
     * API: Get character detail (JSON)
     * 
     * @param string $id Character ID
     * @return string
     */
    public function detail(string $id): string
    {
        return $this->json([
            'success' => true,
            'message' => 'API endpoint ready.',
            'characterId' => (int) $id,
            'data' => null,
        ]);
    }

    /**
     * API: Soft delete character (JSON)
     * 
     * @param string $id Character ID
     * @return string
     */
    public function delete(string $id): string
    {
        return $this->json([
            'success' => true,
            'message' => 'Soft delete',
            'characterId' => (int) $id,
        ]);
    }

    /**
     * API: Restore soft deleted character (JSON)
     * 
     * @param string $id Character ID
     * @return string
     */
    public function restore(string $id): string
    {
        return $this->json([
            'success' => true,
            'message' => 'Restore endpoint',
            'characterId' => (int) $id,
        ]);
    }
}
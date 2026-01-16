<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Services\CharacterService;
use App\Services\ApiException;

class CharacterController extends Controller
{
    private CharacterService $characterService;

    public function __construct()
    {
        $this->characterService = new CharacterService();
    }

    public function index(): string
    {
        $filters = [
            'name' => $this->query('name', ''),
            'status' => $this->query('status', ''),
            'species' => $this->query('species', ''),
            'gender' => $this->query('gender', ''),
            'page' => (int) $this->query('page', 1),
        ];

        return $this->view('characters/index', [
            'title' => 'Rick & Morty Characters',
            'filters' => $filters,
            'statuses' => $this->characterService->getStatuses(),
            'species' => $this->characterService->getSpecies(),
            'genders' => $this->characterService->getGenders(),
        ]);
    }

    public function show(string $id): string
    {
        return $this->view('characters/show', [
            'title' => 'Character Detail',
            'characterId' => (int) $id,
        ]);
    }

    public function list(): string
    {
        try {
            $filters = [
                'name' => $this->query('name', ''),
                'status' => $this->query('status', ''),
                'species' => $this->query('species', ''),
                'gender' => $this->query('gender', ''),
            ];
            $page = (int) $this->query('page', 1);

            $result = $this->characterService->getAll($filters, $page);

            return $this->json($result);
        } catch (ApiException $e) {
            return $this->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getStatusCode() ?: 500);
        } catch (\Throwable $e) {
            return $this->json([
                'success' => false,
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    public function detail(string $id): string
    {
        try {
            $result = $this->characterService->getById((int) $id);

            if ($result === null) {
                return $this->json([
                    'success' => false,
                    'error' => 'Character not found',
                ], 404);
            }

            return $this->json($result);
        } catch (ApiException $e) {
            return $this->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getStatusCode() ?: 500);
        } catch (\Throwable $e) {
            return $this->json([
                'success' => false,
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    public function delete(string $id): string
    {
        return $this->json([
            'success' => true,
            'message' => 'Soft delete - to be implemented in Phase 8',
            'characterId' => (int) $id,
        ]);
    }

    public function restore(string $id): string
    {
        return $this->json([
            'success' => true,
            'message' => 'Restore - to be implemented in Phase 8',
            'characterId' => (int) $id,
        ]);
    }
}

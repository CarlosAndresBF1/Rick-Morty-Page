<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Services\CharacterService;
use App\Services\ApiException;
use App\Models\DeletedCharacter;
use App\Models\StarredCharacter;

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

            // Filter out deleted characters
            $deletedIds = DeletedCharacter::getDeletedIds();
            if (!empty($deletedIds) && !empty($result['data'])) {
                $result['data'] = array_values(array_filter($result['data'], function ($character) use ($deletedIds) {
                    return !in_array($character['id'], $deletedIds);
                }));
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

    public function detail(string $id): string
    {
        try {
            $characterId = (int) $id;

            // Check if character is deleted
            if (DeletedCharacter::isDeleted($characterId)) {
                return $this->json([
                    'success' => false,
                    'error' => 'Character has been deleted',
                ], 404);
            }

            $result = $this->characterService->getById($characterId);

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
        try {
            $characterId = (int) $id;

            if (DeletedCharacter::isDeleted($characterId)) {
                return $this->json([
                    'success' => false,
                    'error' => 'Character is already deleted',
                ], 400);
            }

            DeletedCharacter::softDelete($characterId);

            // Also remove from starred if it was starred
            StarredCharacter::unstar($characterId);

            return $this->json([
                'success' => true,
                'message' => 'Character deleted successfully',
                'characterId' => $characterId,
            ]);
        } catch (\Throwable $e) {
            return $this->json([
                'success' => false,
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    public function restore(string $id): string
    {
        try {
            $characterId = (int) $id;

            if (!DeletedCharacter::isDeleted($characterId)) {
                return $this->json([
                    'success' => false,
                    'error' => 'Character is not deleted',
                ], 400);
            }

            DeletedCharacter::restore($characterId);

            return $this->json([
                'success' => true,
                'message' => 'Character restored successfully',
                'characterId' => $characterId,
            ]);
        } catch (\Throwable $e) {
            return $this->json([
                'success' => false,
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    // API endpoint for starring/unstarring characters
    public function toggleStar(string $id): string
    {
        try {
            $characterId = (int) $id;

            // Check if character is deleted
            if (DeletedCharacter::isDeleted($characterId)) {
                return $this->json([
                    'success' => false,
                    'error' => 'Cannot star a deleted character',
                ], 400);
            }

            $result = StarredCharacter::toggle($characterId);

            return $this->json([
                'success' => true,
                'starred' => $result['starred'],
                'characterId' => $characterId,
            ]);
        } catch (\Throwable $e) {
            return $this->json([
                'success' => false,
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    // API endpoint to get all starred character IDs
    public function getStarred(): string
    {
        try {
            $starredIds = StarredCharacter::getStarredIds();

            return $this->json([
                'success' => true,
                'data' => $starredIds,
            ]);
        } catch (\Throwable $e) {
            return $this->json([
                'success' => false,
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    // API endpoint to get all deleted character IDs
    public function getDeleted(): string
    {
        try {
            $deletedIds = DeletedCharacter::getDeletedIds();

            return $this->json([
                'success' => true,
                'data' => $deletedIds,
            ]);
        } catch (\Throwable $e) {
            return $this->json([
                'success' => false,
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }
}

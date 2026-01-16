<?php

declare(strict_types=1);

namespace App\Services;

class CharacterService
{
    private ApiClient $api;
    private Cache $cache;
    private const CACHE_TTL = 300;

    public function __construct(?ApiClient $api = null, ?Cache $cache = null)
    {
        $this->api = $api ?? new ApiClient(config('api.base_url'));
        $this->cache = $cache ?? new Cache(BASE_PATH . '/storage/cache');
    }

    public function getAll(array $filters = [], int $page = 1): array
    {
        $params = array_filter([
            'page' => $page,
            'name' => $filters['name'] ?? null,
            'status' => $filters['status'] ?? null,
            'species' => $filters['species'] ?? null,
            'gender' => $filters['gender'] ?? null,
        ]);

        $cacheKey = 'characters_' . md5(json_encode($params));

        return $this->cache->remember($cacheKey, function () use ($params) {
            try {
                $response = $this->api->get('character', $params);
                return [
                    'success' => true,
                    'data' => $response['results'] ?? [],
                    'info' => $response['info'] ?? [
                        'count' => 0,
                        'pages' => 0,
                        'next' => null,
                        'prev' => null,
                    ],
                ];
            } catch (ApiException $e) {
                if ($e->isNotFound()) {
                    return [
                        'success' => true,
                        'data' => [],
                        'info' => [
                            'count' => 0,
                            'pages' => 0,
                            'next' => null,
                            'prev' => null,
                        ],
                    ];
                }
                throw $e;
            }
        }, self::CACHE_TTL);
    }

    public function getById(int $id): ?array
    {
        $cacheKey = "character_{$id}";

        return $this->cache->remember($cacheKey, function () use ($id) {
            try {
                $character = $this->api->get("character/{$id}");
                return [
                    'success' => true,
                    'data' => $character,
                ];
            } catch (ApiException $e) {
                if ($e->isNotFound()) {
                    return null;
                }
                throw $e;
            }
        }, self::CACHE_TTL);
    }

    public function getMultiple(array $ids): array
    {
        if (empty($ids)) {
            return [];
        }

        $idsString = implode(',', $ids);
        $cacheKey = "characters_multiple_{$idsString}";

        return $this->cache->remember($cacheKey, function () use ($idsString) {
            $response = $this->api->get("character/{$idsString}");

            if (isset($response['id'])) {
                return [$response];
            }

            return $response;
        }, self::CACHE_TTL);
    }

    public function getStatuses(): array
    {
        return ['Alive', 'Dead', 'unknown'];
    }

    public function getSpecies(): array
    {
        return [
            'Human',
            'Alien',
            'Humanoid',
            'Robot',
            'Animal',
            'Mythological Creature',
            'Poopybutthole',
            'Cronenberg',
            'Disease',
            'unknown',
        ];
    }

    public function getGenders(): array
    {
        return ['Female', 'Male', 'Genderless', 'unknown'];
    }

    public function clearCache(): bool
    {
        return $this->cache->clear();
    }
}

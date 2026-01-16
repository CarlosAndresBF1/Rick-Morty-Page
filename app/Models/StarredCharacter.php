<?php

namespace App\Models;

use App\Database\Database;
use PDO;

class StarredCharacter
{
    public static function isStarred(int $characterId): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT 1 FROM starred_characters WHERE character_id = ?');
        $stmt->execute([$characterId]);
        return $stmt->fetch() !== false;
    }

    public static function getStarredIds(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('SELECT character_id FROM starred_characters');
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public static function star(int $characterId): bool
    {
        if (self::isStarred($characterId)) {
            return false;
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('INSERT INTO starred_characters (character_id) VALUES (?)');
        return $stmt->execute([$characterId]);
    }

    public static function unstar(int $characterId): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('DELETE FROM starred_characters WHERE character_id = ?');
        $stmt->execute([$characterId]);
        return $stmt->rowCount() > 0;
    }

    public static function toggle(int $characterId): array
    {
        if (self::isStarred($characterId)) {
            self::unstar($characterId);
            return ['starred' => false];
        } else {
            self::star($characterId);
            return ['starred' => true];
        }
    }

    public static function getAll(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('SELECT character_id, created_at FROM starred_characters ORDER BY created_at DESC');
        return $stmt->fetchAll();
    }
}

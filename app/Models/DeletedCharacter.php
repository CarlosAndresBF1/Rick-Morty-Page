<?php

namespace App\Models;

use App\Database\Database;
use PDO;

class DeletedCharacter
{
    public static function isDeleted(int $characterId): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT 1 FROM deleted_characters WHERE character_id = ?');
        $stmt->execute([$characterId]);
        return $stmt->fetch() !== false;
    }

    public static function getDeletedIds(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('SELECT character_id FROM deleted_characters');
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public static function softDelete(int $characterId): bool
    {
        if (self::isDeleted($characterId)) {
            return false;
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('INSERT INTO deleted_characters (character_id) VALUES (?)');
        return $stmt->execute([$characterId]);
    }

    public static function restore(int $characterId): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('DELETE FROM deleted_characters WHERE character_id = ?');
        $stmt->execute([$characterId]);
        return $stmt->rowCount() > 0;
    }

    public static function getAll(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query('SELECT character_id, deleted_at FROM deleted_characters ORDER BY deleted_at DESC');
        return $stmt->fetchAll();
    }
}

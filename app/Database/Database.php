<?php

namespace App\Database;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $instance = null;
    private static string $dbPath;

    public static function init(string $dbPath): void
    {
        self::$dbPath = $dbPath;
    }

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            try {
                $dbDir = dirname(self::$dbPath);
                if (!is_dir($dbDir)) {
                    mkdir($dbDir, 0755, true);
                }

                self::$instance = new PDO(
                    'sqlite:' . self::$dbPath,
                    null,
                    null,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]
                );

                // Enable foreign keys
                self::$instance->exec('PRAGMA foreign_keys = ON');
            } catch (PDOException $e) {
                throw new PDOException('Database connection failed: ' . $e->getMessage());
            }
        }

        return self::$instance;
    }

    public static function runMigrations(): void
    {
        $pdo = self::getConnection();

        // Create deleted_characters table for soft deletes
        $pdo->exec('
            CREATE TABLE IF NOT EXISTS deleted_characters (
                id INTEGER PRIMARY KEY,
                character_id INTEGER NOT NULL UNIQUE,
                deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ');

        // Create starred_characters table for favorites
        $pdo->exec('
            CREATE TABLE IF NOT EXISTS starred_characters (
                id INTEGER PRIMARY KEY,
                character_id INTEGER NOT NULL UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ');
    }
}

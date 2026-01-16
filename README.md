# Rick and Morty Character Explorer

Aplicacion web para explorar personajes de Rick and Morty, desarrollada con PHP 8.3 puro (sin frameworks), arquitectura MVC, TailwindCSS y Docker.

**Proyecto desarrollado para Blossom**

---

## Tabla de Contenidos

1. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
2. [Requisitos](#requisitos)
3. [Ejecucion Local con Docker](#ejecucion-local-con-docker)
4. [Ejecucion Local sin Docker](#ejecucion-local-sin-docker)
5. [Deploy en Servidor Ubuntu](#deploy-en-servidor-ubuntu)
6. [API Endpoints](#api-endpoints)
7. [Consumo de API Externa y Cache](#consumo-de-api-externa-y-cache)
8. [Base de Datos](#base-de-datos)
9. [Design System](#design-system)

---

## Arquitectura del Proyecto

```
rick-morty/
├── app/
│   ├── Controllers/       # Controladores MVC
│   ├── Core/              # Router, View, Controller base
│   ├── Database/          # Conexion SQLite y migraciones
│   ├── Models/            # Modelos de datos
│   ├── Services/          # Servicios (API Client, Cache, Character Service)
│   └── Views/             # Vistas PHP con layouts
├── config/
│   ├── app.php            # Configuracion de la aplicacion
│   └── routes.php         # Definicion de rutas
├── docker/
│   ├── nginx/             # Configuracion Nginx
│   ├── node/              # Dockerfile Node para TailwindCSS
│   └── php/               # Dockerfile PHP-FPM 8.3
├── public/
│   ├── assets/            # CSS, JS, fuentes compiladas
│   └── index.php          # Front controller
├── src/
│   └── css/app.css        # Estilos TailwindCSS fuente
├── storage/
│   ├── cache/             # Cache de API (archivos JSON)
│   └── database/          # Base de datos SQLite
├── docker-compose.yml
├── package.json
└── tailwind.config.js
```

---

## Requisitos

### Para ejecucion con Docker
- Docker 20.10+
- Docker Compose 2.0+
- Puerto 8080 disponible

### Para ejecucion sin Docker
- PHP 8.1+ con extensiones: pdo_sqlite, curl, json
- Node.js 18+ y npm

---

## Ejecucion Local con Docker

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd rick-morty
```

### 2. Levantar los contenedores

```bash
docker compose up --build -d
```

Este comando levanta tres servicios:
- **php**: PHP-FPM 8.3 Alpine (puerto interno 9000)
- **nginx**: Nginx Alpine (puerto 8080:80)
- **node**: Node 22 Alpine para compilar TailwindCSS

### 3. Compilar CSS (primera vez)

```bash
docker compose exec node npm run build
```

### 4. Acceder a la aplicacion

```
http://localhost:8080
```

### Comandos utiles de Docker

```bash
# Ver logs de todos los servicios
docker compose logs -f

# Compilar CSS en modo watch (desarrollo)
docker compose exec node npm run watch

# Reconstruir contenedores
docker compose up --build -d

# Detener servicios
docker compose down

# Detener y eliminar volumenes
docker compose down -v
```

---

## Ejecucion Local sin Docker

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd rick-morty
```

### 2. Instalar dependencias de Node.js

```bash
npm install
```

### 3. Compilar TailwindCSS

```bash
# Compilacion unica
npm run build

# O en modo watch para desarrollo
npm run watch
```

### 4. Crear directorios de almacenamiento

```bash
mkdir -p storage/cache storage/database
chmod -R 755 storage
```

### 5. Iniciar servidor PHP integrado

```bash
php -S localhost:8080 -t public
```

### 6. Acceder a la aplicacion

```
http://localhost:8080
```

### Notas importantes para ejecucion sin Docker

- El servidor PHP integrado es solo para desarrollo, no para produccion.
- Asegurate de que PHP tenga las extensiones necesarias:
  ```bash
  php -m | grep -E "pdo_sqlite|curl|json"
  ```
- Si faltan extensiones en macOS:
  ```bash
  brew install php
  ```
- Si faltan extensiones en Ubuntu:
  ```bash
  sudo apt install php8.3-sqlite3 php8.3-curl
  ```

---

## Deploy en Servidor Ubuntu

### 1. Requisitos del servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Nginx
sudo apt install nginx -y

# Instalar PHP 8.3 y extensiones
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install php8.3-fpm php8.3-sqlite3 php8.3-curl php8.3-xml -y

# Instalar Node.js (para compilar CSS)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install nodejs -y
```

### 2. Clonar el proyecto

```bash
cd /var/www
sudo git clone <repository-url> rick-morty
sudo chown -R www-data:www-data rick-morty
cd rick-morty
```

### 3. Compilar CSS

```bash
npm install
npm run build
```

### 4. Configurar permisos

```bash
sudo mkdir -p storage/cache storage/database
sudo chown -R www-data:www-data storage
sudo chmod -R 755 storage
```

### 5. Configurar Nginx

Crear archivo de configuracion:

```bash
sudo nano /etc/nginx/sites-available/rick-morty
```

Contenido del archivo:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/rick-morty/public;
    index index.php;

    # Logs
    access_log /var/log/nginx/rick-morty-access.log;
    error_log /var/log/nginx/rick-morty-error.log;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Static files cache
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|woff|woff2|otf)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Front controller pattern
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP processing
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Deny access to sensitive files
    location ~ /\.(git|env|htaccess) {
        deny all;
    }

    location ~ ^/(storage|config|app)/ {
        deny all;
    }
}
```

### 6. Activar sitio y reiniciar servicios

```bash
sudo ln -s /etc/nginx/sites-available/rick-morty /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl restart php8.3-fpm
```

### 7. Configurar SSL con Lets Encrypt (recomendado)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tu-dominio.com
```

### 8. Configurar firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## API Endpoints

### Personajes

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/characters` | Listar personajes (paginado, 20 por pagina) |
| GET | `/api/characters?name=rick` | Buscar por nombre |
| GET | `/api/characters?species=Human` | Filtrar por especie |
| GET | `/api/characters?page=2` | Pagina especifica |
| GET | `/api/characters/{id}` | Detalle de un personaje |

### Favoritos (Starred)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/starred` | Obtener IDs de personajes favoritos |
| POST | `/api/characters/{id}/star` | Alternar estado de favorito |

### Soft Delete

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| DELETE | `/api/characters/{id}` | Eliminar personaje (soft delete) |
| POST | `/api/characters/{id}/restore` | Restaurar personaje eliminado |
| GET | `/api/deleted` | Obtener IDs de personajes eliminados |

### Ejemplo de respuesta de listado

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Rick Sanchez",
            "status": "Alive",
            "species": "Human",
            "gender": "Male",
            "origin": { "name": "Earth (C-137)" },
            "location": { "name": "Citadel of Ricks" },
            "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg"
        }
    ],
    "info": {
        "count": 826,
        "pages": 42,
        "next": "https://rickandmortyapi.com/api/character?page=2",
        "prev": null
    }
}
```

---

## Consumo de API Externa y Cache

### API Externa

La aplicacion consume la API publica de Rick and Morty:
- **Base URL**: `https://rickandmortyapi.com/api`
- **Documentacion oficial**: https://rickandmortyapi.com/documentation

### Arquitectura del consumo de API

```
Frontend (JavaScript)
        |
        v
Backend PHP (/api/characters)
        |
        v
CharacterService
        |
        +---> Cache (storage/cache/)
        |           |
        |           v
        |     Archivo JSON con TTL
        |           |
        |           +---> Si existe y es valido: retorna datos cacheados
        |           |
        |           +---> Si no existe o expiro: continua a API externa
        |
        v
ApiClient (cURL)
        |
        v
Rick and Morty API
        |
        v
Respuesta guardada en cache
        |
        v
Retorno al frontend
```

### Implementacion del ApiClient

El archivo `app/Services/ApiClient.php` implementa un cliente HTTP con cURL:

```php
class ApiClient
{
    private string $baseUrl;
    private int $timeout = 30;

    public function __construct(string $baseUrl)
    {
        $this->baseUrl = rtrim($baseUrl, '/');
    }

    public function get(string $endpoint, array $params = []): array
    {
        $url = $this->baseUrl . $endpoint;
        if (!empty($params)) {
            $url .= '?' . http_build_query($params);
        }

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
                'User-Agent: RickMortyExplorer/1.0'
            ],
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new ApiException("cURL Error: {$error}");
        }

        return [
            'status' => $httpCode,
            'data' => json_decode($response, true)
        ];
    }
}
```

### Sistema de Cache

El archivo `app/Services/Cache.php` implementa cache basado en archivos JSON:

```php
class Cache
{
    private string $cachePath;
    private int $defaultTtl = 300; // 5 minutos

    public function __construct(string $cachePath)
    {
        $this->cachePath = rtrim($cachePath, '/');
        if (!is_dir($this->cachePath)) {
            mkdir($this->cachePath, 0755, true);
        }
    }

    public function get(string $key): mixed
    {
        $file = $this->getFilePath($key);
        
        if (!file_exists($file)) {
            return null;
        }

        $content = file_get_contents($file);
        $data = json_decode($content, true);

        // Verificar si el cache ha expirado
        if ($data['expires_at'] < time()) {
            unlink($file);
            return null;
        }

        return $data['value'];
    }

    public function set(string $key, mixed $value, ?int $ttl = null): void
    {
        $file = $this->getFilePath($key);
        $data = [
            'value' => $value,
            'created_at' => time(),
            'expires_at' => time() + ($ttl ?? $this->defaultTtl),
        ];
        
        file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
    }

    private function getFilePath(string $key): string
    {
        // Genera nombre de archivo seguro basado en MD5 del key
        return $this->cachePath . '/' . md5($key) . '.json';
    }
}
```

### Integracion en CharacterService

```php
class CharacterService
{
    private ApiClient $api;
    private Cache $cache;

    public function getAll(array $filters = [], int $page = 1): array
    {
        // Generar clave de cache unica basada en parametros
        $cacheKey = 'characters_' . md5(json_encode($filters) . '_' . $page);
        
        // Intentar obtener de cache
        $cached = $this->cache->get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        // Si no hay cache, consultar API externa
        $params = array_filter($filters);
        $params['page'] = $page;
        
        $response = $this->api->get('/character', $params);
        
        $result = [
            'success' => true,
            'data' => $response['data']['results'] ?? [],
            'info' => $response['data']['info'] ?? null,
        ];

        // Guardar en cache (5 minutos por defecto)
        $this->cache->set($cacheKey, $result);

        return $result;
    }
}
```

### Configuracion del TTL

El tiempo de vida del cache (Time To Live) se puede ajustar en `config/app.php`:

```php
return [
    'cache' => [
        'path' => BASE_PATH . '/storage/cache',
        'ttl' => 300,  // 5 minutos en segundos
    ],
];
```

### Limpieza de cache

Los archivos de cache se almacenan en `storage/cache/` con extension `.json`. Para limpiar manualmente:

```bash
# Eliminar todo el cache
rm -rf storage/cache/*.json

# Ver archivos de cache
ls -la storage/cache/
```

### Beneficios del sistema de cache

1. **Reduccion de latencia**: Las respuestas cacheadas se sirven instantaneamente
2. **Menor carga en API externa**: Reduce el numero de peticiones a la API de Rick and Morty
3. **Resiliencia**: Si la API externa falla, se pueden servir datos cacheados
4. **Control de TTL**: Configurable segun necesidades del proyecto

---

## Base de Datos

La aplicacion utiliza SQLite para persistencia local de favoritos y registros de eliminacion.

### Ubicacion

```
storage/database/app.sqlite
```

### Esquema

```sql
-- Personajes eliminados (soft delete)
CREATE TABLE deleted_characters (
    id INTEGER PRIMARY KEY,
    character_id INTEGER NOT NULL UNIQUE,
    deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Personajes favoritos
CREATE TABLE starred_characters (
    id INTEGER PRIMARY KEY,
    character_id INTEGER NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Migraciones

Las migraciones se ejecutan automaticamente al iniciar la aplicacion. El proceso se realiza en `app/Database/Database.php`:

```php
public static function runMigrations(): void
{
    $pdo = self::getConnection();

    $pdo->exec('
        CREATE TABLE IF NOT EXISTS deleted_characters (
            id INTEGER PRIMARY KEY,
            character_id INTEGER NOT NULL UNIQUE,
            deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ');

    $pdo->exec('
        CREATE TABLE IF NOT EXISTS starred_characters (
            id INTEGER PRIMARY KEY,
            character_id INTEGER NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ');
}
```

### Modelos

Los modelos `DeletedCharacter` y `StarredCharacter` en `app/Models/` proporcionan metodos estaticos para interactuar con la base de datos:

```php
// Verificar si un personaje esta eliminado
DeletedCharacter::isDeleted(int $characterId): bool

// Eliminar un personaje (soft delete)
DeletedCharacter::softDelete(int $characterId): bool

// Restaurar un personaje
DeletedCharacter::restore(int $characterId): bool

// Alternar estado de favorito
StarredCharacter::toggle(int $characterId): array
```
 

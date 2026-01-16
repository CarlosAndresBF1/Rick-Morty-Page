FROM php:8.3-fpm

# Argumentos de build
ARG USER_ID=1000
ARG GROUP_ID=1000

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite mbstring exif pcntl bcmath gd zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Crear usuario para evitar problemas de permisos
RUN groupadd -g ${GROUP_ID} www && \
    useradd -u ${USER_ID} -ms /bin/bash -g www www

# Configurar directorio de trabajo
WORKDIR /var/www/html

# Cambiar ownership
RUN chown -R www:www /var/www/html

# Cambiar al usuario www
USER www

EXPOSE 9000

CMD ["php-fpm"]

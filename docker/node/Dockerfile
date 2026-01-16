FROM node:22-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++

# Crear directorio de trabajo
WORKDIR /var/www/html

# Copiar archivos de configuración de Node
COPY package*.json ./

# Instalar dependencias de Node
RUN npm install

# El comando por defecto será watch de Tailwind
CMD ["npm", "run", "watch"]

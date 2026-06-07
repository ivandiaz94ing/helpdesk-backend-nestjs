# --- Etapa 1: Construcción (Builder) ---
FROM node:22-alpine AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias (necesitamos las de desarrollo para compilar)
RUN npm install

# Copiamos el resto de tu código fuente
COPY . .

# Compilamos el proyecto de NestJS (genera la carpeta /dist)
RUN npm run build

# --- Etapa 2: Producción (Runner) ---
FROM node:22-alpine AS production

# Declaramos que estamos en entorno de producción
ENV NODE_ENV=production

WORKDIR /app

# Copiamos los archivos de dependencias nuevamente
COPY package*.json ./

# 🌟 MAGIA: Instalamos SOLO las dependencias de producción
RUN npm install --omit=dev

# Copiamos ÚNICAMENTE el código ya compilado desde la Etapa 1
COPY --from=builder /app/dist ./dist

# Exponemos el puerto (NestJS suele usar el 3000 por defecto)
EXPOSE 3000

# Comando para levantar la aplicación compilada
CMD ["node", "dist/main"]
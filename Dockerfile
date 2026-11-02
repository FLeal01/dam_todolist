# Imagen de DESARROLLO para To Do List (Expo + React Native + TypeScript).
# Sirve el bundler de Expo; la app se abre en Expo Go o en un emulador del equipo anfitrión.
FROM node:22-slim

ENV EXPO_NO_TELEMETRY=1
WORKDIR /app

# Se copian primero los archivos de dependencias para aprovechar la caché de Docker.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

EXPOSE 8081
CMD ["npx", "expo", "start", "--host", "lan"]

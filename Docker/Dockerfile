# Usar una imagen base de Node.js
FROM node:18-alpine

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos del proyecto al contenedor
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Ajustes para Puppeteer en Alpine
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Establecer permisos para que se pueda escribir y leer en la ruta /app
RUN chmod -R 777 /app

# Exponer el puerto (si es necesario para el bot)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]
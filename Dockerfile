 # Etapa 1: Dependencias y construcción                                                                             
    FROM node:20-alpine AS builder                                                                                     
                                                                                                                       
    WORKDIR /usr/src/app                                                                                               
                                                                                                                       
    # Copiamos package.json y package-lock.json                                                                        
    COPY package*.json ./                                                                                              
                                                                                                                       
    # Instalamos TODAS las dependencias (incluyendo devDependencies para poder compilar)                               
    RUN npm ci                                                                                                         
                                                                                                                       
    # Copiamos el resto del código                                                                                     
    COPY . .                                                                                                           
                                                                                                                       
    # Compilamos la aplicación NestJS (esto generará la carpeta dist)                                                  
    RUN npm run build                                                                                                  
                                                                                                                       
    # Etapa 2: Imagen de producción                                                                                    
    FROM node:20-alpine                                                                                                
                                                                                                                       
    WORKDIR /usr/src/app                                                                                               
                                                                                                                       
    # Establecemos la variable de entorno de node a producción                                                         
    ENV NODE_ENV=production                                                                                            
                                                                                                                       
    # Copiamos solo lo necesario para instalar dependencias de producción                                              
    COPY package*.json ./                                                                                              
                                                                                                                       
    # Instalamos SOLO las dependencias de producción (hace la imagen más ligera)                                       
    RUN npm ci --only=production                                                                                       
                                                                                                                       
    # Copiamos la carpeta dist generada en la etapa anterior                                                           
    COPY --from=builder /usr/src/app/dist ./dist                                                                       
                                                                                                                       
    # Si tienes una carpeta "postgres" u otras que necesites en producción, coméntame.                                 
    # El puerto que expone NestJS por defecto (asegúrate de que coincida con tu main.ts)                               
    EXPOSE 3000                                                                                                        
                                                                                                                       
    # Comando para iniciar la aplicación                                                                               
    CMD ["node", "dist/main"]                                                                                          
                                   
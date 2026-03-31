# étape 1

FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
# (penser au .dockerignore pour ne pas copier certains fichiers)
COPY ./ ./ 

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL


RUN npm run build

# étape 2

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

# Documentation : Nginx expose sur le port 80 dans le conteneur
EXPOSE 80

# -g pour du traitement en global
# daemon off; pour rester au premier plan et continue de tourner
CMD ["nginx", "-g", "daemon off;"]
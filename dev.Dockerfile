# etapa de compilación
FROM node:14.2-alpine as build-stage

WORKDIR /app
EXPOSE 4200

COPY package* ./
RUN npm install
COPY . .

# CMD ["npm", "run", "ng", "serve"]
CMD ["npm", "run", "ng", "serve", "--", "--host=0.0.0.0", "--disable-host-check"]
FROM node:18-alpine
WORKDIR /app
COPY ./server/package*.json ./
RUN npm ci
COPY ./server ./
EXPOSE 3000
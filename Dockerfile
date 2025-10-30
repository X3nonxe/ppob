FROM node:20-alpine AS build
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN rm -rf node_modules && npm install

EXPOSE 8080
CMD ["node", "app.js"]
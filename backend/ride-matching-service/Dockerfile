# Build Stage
FROM node AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Production Stage
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app /app

RUN npm prune --production

EXPOSE 5001

ENV NODE_ENV=production
ENV MONGO_URI=mongodb://mongo:27017/uberclone
ENV KAFKA_BROKER_URL=kafka:9092
ENV JWT_SECRET=your_jwt_secret

CMD ["node", "src/server.js"]

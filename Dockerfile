FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json
RUN npm install --no-audit --no-fund
COPY client ./client
RUN npm run build -w client
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY server/package.json server/package.json
COPY client/package.json client/package.json
RUN npm install --omit=dev --no-audit --no-fund
COPY server ./server
COPY --from=build /app/client/dist ./client/dist
EXPOSE 4000
CMD ["npm","run","start","-w","server"]

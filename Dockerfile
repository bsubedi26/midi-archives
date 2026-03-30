# sql.js is WASM — no native build tools required
FROM node:16-bullseye-slim AS builder
WORKDIR /app
COPY package.json .npmrc ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json .npmrc ./
RUN npm install --omit=dev
COPY server.js server.babel.js ./
COPY .babelrc ./
COPY server ./server
COPY public ./public
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "server.js"]

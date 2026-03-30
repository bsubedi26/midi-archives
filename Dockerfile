# sql.js is WASM — no native build tools required
FROM node:16-bullseye-slim AS builder
WORKDIR /app
COPY package.json .npmrc ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-bullseye-slim
WORKDIR /app
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json .npmrc ./
RUN if [ "$NODE_ENV" = "production" ]; then npm install --omit=dev; else npm install; fi
COPY server.js server.babel.js ./
COPY .babelrc ./
COPY server ./server
COPY public ./public
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "server.js"]

FROM node:26-trixie-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:26-trixie-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY src/server ./src/server
COPY src/common ./src/common
COPY --from=build /usr/src/app/dist/client ./dist/client

RUN mkdir logs && chown node:node logs

USER node

CMD ["npm", "run", "start:prod"]

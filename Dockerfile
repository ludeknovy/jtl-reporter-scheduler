FROM node:24.22-alpine AS builder

WORKDIR /src

COPY package.json package-lock.json ./

RUN npm ci

COPY . ./

RUN npm run build

FROM node:24.22-alpine

WORKDIR /src

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /src/dist ./dist

CMD [ "npm", "run", "start" ]

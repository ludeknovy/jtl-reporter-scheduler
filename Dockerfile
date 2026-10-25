FROM node:24.22-alpine

WORKDIR /src

COPY package.json package-lock.json  ./

RUN npm ci --only=prod

COPY . ./


RUN npm run build

CMD [ "npm", "run", "start" ]

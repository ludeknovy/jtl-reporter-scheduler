FROM node:18.18.0-alpine3.17

WORKDIR /src

COPY package.json package-lock.json  ./

RUN npm ci --only=prod

COPY . ./


RUN npm run build

CMD [ "npm", "run", "start" ]

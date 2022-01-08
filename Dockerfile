FROM node:16.13.1-alpine3.14

WORKDIR /src

COPY package.json package-lock.json  ./

RUN npm ci --only=prod

COPY . ./


RUN npm run build

CMD [ "npm", "run", "start" ]

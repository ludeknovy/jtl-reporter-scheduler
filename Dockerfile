FROM node:20.18.2-alpine3.20

WORKDIR /src

COPY package.json package-lock.json  ./

RUN npm ci --only=prod

COPY . ./


RUN npm run build

CMD [ "npm", "run", "start" ]

FROM node:19-alpine

RUN apk add --no-cache mysql-client

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN npm run build

EXPOSE 3002

CMD ["npm", "start"]

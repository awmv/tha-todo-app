FROM node:19-alpine

RUN apk add --no-cache \
    build-base \
    g++ \
    libpng-dev \
    nasm \
    python3

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN npm run build

ENV NUXT_HOST=0.0.0.0

ENV NUXT_PORT=3000

EXPOSE 3000 

CMD ["nuxt", "dev"]

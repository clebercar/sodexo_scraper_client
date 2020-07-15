FROM node:12.14.0-alpine3.9

RUN apk update && apk add --no-cache \
    openssh \
    git \
    make \
    build-base \
    curl

WORKDIR /app

COPY . /app

RUN npm install -g create-react-app

RUN yarn install

CMD ["yarn", "start"]
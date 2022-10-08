FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY * client/

USER node

CMD [ "npm", "start" ]

EXPOSE 80
FROM node:13.14-alpine3.10 as compiler

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

CMD npm start
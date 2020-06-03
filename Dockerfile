FROM node:13.14-buster as compiler

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

CMD npm start

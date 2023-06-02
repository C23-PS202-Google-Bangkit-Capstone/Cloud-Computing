FROM node:18.15.0-alpine3.16

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 8080

CMD ["npm", "start"]
FROM node:18.15.0-alpine3.16

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . . 

COPY .env /.env

COPY ./controller/credentials/user-upload.json ./credentials/user-upload.json

COPY ./config/credentials/user-upload.json ./credentials/user-upload-2.json

EXPOSE 8080

CMD ["npm", "start"]

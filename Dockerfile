FROM node:16-alpine

WORKDIR /

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 6000

RUN npm run build
CMD [ "npm", "run", "start"]
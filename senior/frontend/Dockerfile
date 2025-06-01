FROM node:24-alpine

WORKDIR /app

COPY codes/package*.json ./

RUN npm install

COPY codes/ .

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM node:24-alpine

WORKDIR /app

COPY codes/package*.json ./

RUN npm install

COPY codes/ .

EXPOSE 3000

ENV NEXT_PUBLIC_BACKEND_API=murabei-backend/api/v1

CMD ["npm", "run", "dev"]

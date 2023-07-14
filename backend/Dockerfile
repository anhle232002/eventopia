FROM node:lts-alpine AS node_builder

WORKDIR /app

COPY package.json .

COPY prisma ./prisma/

RUN npm cache clean --force

RUN npm install

COPY . ./

COPY .env.prisma .env

RUN npm run build

CMD [ "npm", "run", "start:migrate:prod" ]

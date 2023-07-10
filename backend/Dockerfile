FROM node:lts-alpine AS node_builder

WORKDIR /app

COPY package.json .

COPY prisma ./prisma/

RUN npm cache clean --force

RUN npm install

COPY . ./

COPY .env.prisma .env

EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "start:migrate:prod" ]

FROM node:22

WORKDIR /seminar/apps/back
COPY apps/back/package.json ./
COPY apps/back/tsconfig.json ./


WORKDIR /seminar/packages
COPY packages ./

WORKDIR /seminar
COPY package.json ./

RUN npm install

RUN prisma generate

RUN prisma db push

CMD [ "npm", "run", "back:dev" ]

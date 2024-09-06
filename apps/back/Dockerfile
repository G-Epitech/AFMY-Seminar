FROM node:22

WORKDIR /seminar/apps/back
COPY apps/back/package.json ./
COPY apps/back/tsconfig.json ./
COPY apps/back/prisma ./


WORKDIR /seminar/packages
COPY packages ./

WORKDIR /seminar
COPY package.json package-lock.json ./

RUN npm ci --omit=optional

WORKDIR /seminar/apps/back

RUN npx prisma generate

WORKDIR /seminar

CMD [ "npm", "run", "back:dev"]

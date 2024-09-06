FROM node:22

WORKDIR /seminar/apps/front
COPY apps/front/package.json ./
COPY apps/front/postcss.config.mjs apps/front/tailwind.config.ts ./
COPY apps/front/tsconfig.json apps/front/next.config.mjs ./

WORKDIR /seminar/packages
COPY packages ./

WORKDIR /seminar
COPY package.json package-lock.json ./

RUN npm install

CMD [ "npm", "run", "front:dev" ]

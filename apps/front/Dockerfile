FROM node:22

WORKDIR /app

COPY package.json ./
COPY postcss.config.mjs tailwind.config.ts ./
COPY tsconfig.json next.config.mjs ./

RUN npm install

CMD [ "npm", "run", "dev" ]

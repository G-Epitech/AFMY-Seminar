FROM node:22

WORKDIR /app

COPY package.json package-lock.json ./
COPY tailwind.config.ts ./
COPY postcss.config.mjs ./
COPY next.config.mjs ./
COPY tsconfig.json ./

RUN npm install

CMD [ "npm", "run", "dev" ]

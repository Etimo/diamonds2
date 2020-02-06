FROM node:12-alpine3.9 as dist
WORKDIR /tmp/
COPY package.json yarn.lock tsconfig.json tsconfig.build.json ./
COPY src/ src/
RUN yarn install
RUN yarn run build

FROM node:12-alpine3.9 as node_modules
WORKDIR /tmp/
COPY package.json yarn.lock ./
RUN yarn install --production

FROM node:12-alpine3.9
WORKDIR /src
COPY --from=node_modules /tmp/node_modules ./node_modules
COPY --from=dist /tmp/dist ./dist
CMD ["node", "dist/main.js"]
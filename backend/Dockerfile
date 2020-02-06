FROM node:12-alpine3.9 as develop
WORKDIR /src
RUN yarn install

FROM node:12-alpine3.9 as build
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN yarn run build

FROM node:12-alpine3.9 as prod
WORKDIR /src
COPY --from=dist /src/dist ./dist
CMD ["node", "dist/main.js"]

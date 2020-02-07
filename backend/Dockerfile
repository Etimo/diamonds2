FROM node:12-alpine3.9 as develop
WORKDIR /app
COPY . /app
RUN yarn

FROM node:12-alpine3.9 as build
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN yarn run build

FROM node:12-alpine3.9 as prod
WORKDIR /app
COPY --from=dist /app/dist ./dist
CMD ["node", "dist/main.js"]

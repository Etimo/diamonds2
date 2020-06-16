FROM node:12-alpine3.9 as develop
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
# RUN ./node_modules/.bin/tsc src/migration/*.ts

FROM develop as build
RUN yarn build --webpack

FROM node:12-alpine3.9 as prod
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY package.json yarn.lock ./
RUN yarn install --production
COPY tsconfig.json ./
COPY ormconfig.prod.js ./ormconfig.js
EXPOSE 5000
CMD ["yarn", "start:prod"]

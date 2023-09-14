FROM node:20.6.1-alpine3.18 as develop
WORKDIR /app
RUN apk add openssl1.1-compat
COPY package.json yarn.lock ./
RUN echo
RUN yarn
COPY tsconfig.json ./
# RUN ./node_modules/.bin/tsc src/migration/*.ts

FROM develop as build
RUN yarn build --webpack

FROM node:16-alpine3.17 as prod
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY package.json yarn.lock ./
RUN yarn install --production
COPY tsconfig.json ./
COPY ormconfig.prod.js ./ormconfig.js
COPY /src/data /app/dist/data
COPY /src/migration /app/dist/migration
EXPOSE 5000
CMD ["yarn", "start:prod"]

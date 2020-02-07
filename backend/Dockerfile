FROM node:12-alpine3.9 as develop
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .

FROM develop as build
RUN yarn build

FROM node:12-alpine3.9 as prod
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY package.json yarn.lock ./
RUN yarn install --production
EXPOSE 5000
CMD ["yarn", "start:prod"]

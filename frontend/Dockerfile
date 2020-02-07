FROM node:12-alpine3.9 as develop
WORKDIR /app
COPY . .
VOLUME /app/src
RUN yarn

FROM node:12-alpine3.9 as build
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN yarn build

FROM nginx:mainline-alpine as prod
WORKDIR /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx-conf/* /etc/nginx/conf.d/
COPY --from=build /app/build/ .
EXPOSE 3000
FROM node:11.13-alpine

WORKDIR /build
ADD ./package.json .
RUN yarn install

ADD . .
RUN yarn build

FROM nginx:mainline-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx-conf/ /etc/nginx/conf.d/

WORKDIR /usr/share/nginx/html
COPY --from=0 /build/build/ .

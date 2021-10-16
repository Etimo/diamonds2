# Diamonds2 backend

This is the repo for the backend part of Diamonds2.

## Start

Start server:

```
yarn
yarn run start:dev
```

## Test

```
yarn test
```

## Run production build

```
yarn run build
yarn run start:prod
```

## Database and migrations

When you change your db models you need to create a new migration for the changes:

```
yarn run typeorm:migration:generate <name>
```

To synchronize your database and apply any missing migrations:

```
yarn run typeorm:migration:run
```

## Initial start

All pre-existing migrations will be run on initial start. This assumes that it can find information about migrations.

If migrations can't be run, prune database from docker volumes and re-run `docker-compose up`

To prune diamonds volumes:

```
docker volume rm diamonds2_db-data
docker volume rm diamonds2_bot-data
```

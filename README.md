Master branch:

[![Build Status](https://travis-ci.com/Etimo/diamonds2.svg?branch=master)](https://travis-ci.com/Etimo/diamonds2)
[![Coverage Status](https://coveralls.io/repos/github/Etimo/diamonds2/badge.svg?branch=master)](https://coveralls.io/github/Etimo/diamonds2?branch=master)

Develop branch:

[![Build Status](https://travis-ci.com/Etimo/diamonds2.svg?branch=develop)](https://travis-ci.com/Etimo/diamonds2)
[![Coverage Status](https://coveralls.io/repos/github/Etimo/diamonds2/badge.svg?branch=develop)](https://coveralls.io/github/Etimo/diamonds2?branch=develop)

License:

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# 💎 Etimo Diamonds2

Diamonds is a programming challenge. Program a bot and compete to get the highest score. 

## Development

Run the following commands to setup a development environment using Docker:

```
docker-compose build --parallel
docker-compose up
```

* Frontend: [http://localhost:8080](http://localhost:8080)
* API: [http://localhost:8081](http://localhost:8081)
* Database (browsing): [http://localhost:8082](http://localhost:8082/?pgsql=database&username=postgres&db=postgres)

## Production (from source)

To run Diamonds from source in production mode you first need to have a database setup somewhere. Then you need to expose the following environment variables pointing out the database:

```
DIAMONDS_ORM_HOST
DIAMONDS_ORM_PORT
DIAMONDS_ORM_DATABASE
DIAMONDS_ORM_USERNAME
DIAMONDS_ORM_PASSWORD
```

Then run the following commands from the root folder:

```
docker-compose -f docker-compose.prod-build.yml build --parallel
docker-compose -f docker-compose.prod-build.yml up
```

This will not expose the database like in development mode, and serve frontend from nginx instead of using node. It will also install less packages.

## Production (using prebuilt docker images)

To run Diamonds in production mode using prebuilt docker images you will need the same environment variables as described in the previous section. Then run docker-compose using a specific tag as environment variable:

```
DIAMONDS_DOCKER_TAG=latest docker-compose -f docker-compose.prod-run.yml up
```

This setup is used when running Diamonds using the [auto deployer](deployer/).
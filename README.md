Master branch:

[![Build Status](https://travis-ci.com/Etimo/diamonds2.svg?branch=master)](https://travis-ci.com/Etimo/diamonds2)
[![Coverage Status](https://coveralls.io/repos/github/Etimo/diamonds2/badge.svg?branch=master)](https://coveralls.io/github/Etimo/diamonds2?branch=master)

Develop branch:

[![Build Status](https://travis-ci.com/Etimo/diamonds2.svg?branch=develop)](https://travis-ci.com/Etimo/diamonds2)
[![Coverage Status](https://coveralls.io/repos/github/Etimo/diamonds2/badge.svg?branch=develop)](https://coveralls.io/github/Etimo/diamonds2?branch=develop)

License:

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Etimo Diamonds2

Diamonds is a programming challenge. Program a bot and compete to get the highest score. 🤖🔷

## Development

Run the following commands to setup a development environment using Docker:

```
docker-compose build --parallel
docker-compose up
```

* Frontend: [http://localhost:8080](http://localhost:8080)
* API: [http://localhost:8081](http://localhost:8081)
* Database (browsing): [http://localhost:8082](http://localhost:8082/?pgsql=database&username=postgres&db=postgres)

## Production

To run Diamonds in production, run the following commands from the root folder:

```
docker-compose -f docker-compose.prod.yml build --parallel
docker-compose -f docker-compose.prod.yml up
```

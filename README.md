[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# 💎 Etimo Diamonds 2

Diamonds is a programming challenge. Program a bot and compete to get the
highest score.

## Want to play? 🕹

- Read the [game rules and how to get started](RULES.md)
- Try the api using Swagger either [locally](http://localhost:3000/docs) or
  [live](http://diamonds.etimo.se/docs/)

If you find a bug or has a suggestion for improvement you are more than welcome
to [submit an issue](https://github.com/Etimo/diamonds2/issues/new) or
[pull request](https://github.com/Etimo/diamonds2/compare)!

## Requirements

Deno

## Development 💻

1. Install dependencies

```sh
deno install --allow-scripts
```

2. Setup default environment variables

```sh
deno run env
```

3. Setup local database

Either

```sh
deno run init-db
deno run support
```

or

```sh
deno run support
# Wait for db to start and navigate to packages/backend
cd packages/backend
# Update db schema
deno run db:push
# Seed the database
deno run db:seed
```

4. Start everything

```sh
deno run start
```

Frontend: http://localhost:8082

Swagger: http://localhost:3000/docs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# 💎 Etimo Diamonds 2

Diamonds is a programming challenge. Program a bot and compete to get the highest score.

## Want to play? 🕹

- Read the [game rules and how to get started](RULES.md).
- Try the api using Swagger either [locally](http://localhost:3000/docs) or [live](http://diamonds.etimo.se/docs/)

If you find a bug or has a suggestion for improvement you are more than welcome to [submit an issue](https://github.com/Etimo/diamonds2/issues/new) or [pull request](https://github.com/Etimo/diamonds2/compare)!

## Development 💻

Install dependencies:

```
yarn
```

Setup default environment variables:

```
npm run env
```

Setup local database:

```
npm run support
# wait for db to start
(cd packages/backend && npx prisma db push)
```

Start everything:

```
npm run start
```

Frontend: http://localhost:8082
Swagger: http://localhost:3000/docs

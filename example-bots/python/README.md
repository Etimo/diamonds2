# Simple bot

## How to install

```bash
pip install pipenv
pipenv sync
```

## Register bot

First you need to register one or more bots if not already done. This can be done using the following command:

`pipenv run start --name <name> --email <email> --password <password> --team <team> --logic <logic>`

Add the team abbreviation of the team you want your bot to be a part of.
You can see a list of all teams at diamonds.etimo.se/teams.

The application will print out a token if the registration was successful. Don't loose this token, you have to use this token to control your bot.

## Run a game session

When you have a token you can start a new game session (or continue an existing one) using the following command:

`pipenv run start --token <token> --logic <logic>`

The bot will play using the logic controller provided until game over. You can then run the bot again without having to register a new one.

Register multiple bots and play them all at once if you like!

## Different logic controllers

Bots can play using different controllers (AI). There are two logic controllers implemented in this repository, namely:

- `game/logic/first_diamond.py`
- `game/logic/random.py`

All controllers implement a method called `next_move` that is called to calculate the next move given a board state.

You can use any of these two implementations as a start for your own implementation.

## Fetch a lost token

You can fetch a lost token using the `api/bots/recover` endpoint.

Send a `POST` request to the endpoint and add `"email": <email>, "password": <password>` to the body.

You will then recieve information about the bot.

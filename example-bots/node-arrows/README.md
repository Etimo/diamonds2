# Simple Node bot

```
yarn install
sudo npm link
```

## Register bot

First you need to register one or more bots if not already done. This can be
done using the following command:

`bot register --name <name> --email <email> --password <password> --team <team>`

Add the team abbreviation of the team you want your bot to be a part of. You can
see a list of all teams at diamonds.etimo.se/teams.

The application will print out a token if the registration was successful. Don't
loose this token, you have to use this token to control your bot.

## Run a game session

When you have a token you can start a new game session (or continue an existing
one) using the following command:

`bot play --token <token>`

Provide `--board <number>` if you want to join a specific board. Default is
board 1.

You can then use the arrow functions on your keyboard to play.

Register multiple bots and play them all at once if you like!

## Fetch a lost token

You can fetch a lost token using the `api/bots/recover` endpoint.

Send a `POST` request to the endpoint and add
`"email": <email>, "password": <password>` to the body.

You will then recieve information about the bot.

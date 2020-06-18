# Simple Node bot

```

yarn install
sudo npm link

```

## Register bot

First you need to register one or more bots if not already done. This can be done using the following command:

`bot register --name <name> --email <email>`

The application will print out a token if the registration was successful. Don't loose this token, it is your password to be able to play using this bot!

## Run a game session

When you have a token you can start a new game session (or continue an existing one) using the following command:

`bot play --token <token> --logic <logic>`

Provide `--board <number>` if you want to join a specific board. Default is board 1.

The bot will play using the logic you provide until game over. You can then run the bot again without having to register a new one.

Register multiple bots and play them all at once if you like!

## Different logic controllers

- `src/logic/firstDiamond.js`

All logics contains a function called that is called to calculate the next target position given a board state.

You can use any the current implementation as a start for your own implementation.

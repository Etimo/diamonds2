Simple bot
==========

How to install
--------------

```bash
pip install pipenv
pipenv sync
```


Register bot
------------

First you need to register one or more bots if not already done. This can be done using the following command:

`pipenv run start --name <name> --email <email> --logic <logic>`

The application will print out a token if the registration was successful. Don't loose this token, it is your password to be able to play using this bot!


Run a game session
------------------

When you have a token you can start a new game session (or continue an existing one) using the following command:

`pipenv run start --token <token> --logic <logic>`

The bot will play using the logic controller provided until game over. You can then run the bot again without having to register a new one.

Register multiple bots and play them all at once if you like!


Different logic controllers
---------------------------

Bots can play using different controllers (AI). There are two logic controllers implemented in this repository, namely:

* `game/logic/first_diamond.py`
* `game/logic/random.py`

All controllers implement a method called `next_move` that is called to calculate the next move given a board state.

You can use any of these two implementations as a start for your own implementation.

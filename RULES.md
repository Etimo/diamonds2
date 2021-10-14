# Game rules

The purpose of the game is to collect as many diamonds as possible and deliver them to the base within one minute. The bot can carry at most 5 diamonds, so it needs to deliver the diamonds to the base often.

There are sometimes multiple boards available. Also different boards could have different configurations and features available. To check which boards are available and their configurations you can use the api call `GET /api/boards`. This will return an array of all available boards. Explore the return value and the configurations and see what you can find! Some of the configuration values are explained in the rules below as well.

## Red button / Diamond button

The red button triggers a regeneration of all diamonds on the board when stepped on. When new diamonds are generated the red button will also be regenerated.

The diamond button is enabled by the feature `DiamondButtonProvider` in the board configuration.

## Diamonds

Diamonds will respawn whenever depleted. Red diamonds count as 2 diamonds (and take up 2 spaces in your inventory) so they are twice as valuable as blue diamonds. The ratio between red and blue diamonds changes on each regeneration.

The diamonds are enabled by the feature `DiamondProvider` in the board configuration.

## Teleporters

The multi-colored discs are teleporters.

The teleporters are enabled by the feature `TeleportProvider` in the board configuration.

## Bots and bases

All bots will have a home base with their name on. This is where you have to go to drop off the diamonds you are carrying.

## Tackle
Bots can tackle eachother. If bot A tackles bot B (walk into bot B's position) bot B will be sent to its base and lose all diamonds. Bot A will receive bot B's diamonds. Tackle is enabled by the feature `BotProvider` in the board configuration.

## Request limit
You are only allowed to send one request every X milliseconds. If you send 10 requests too fast you will be kicked from the board. Check the key `minimumDelayBetweenMoves` in the board configuration to know how long the minimum delay between moves is.

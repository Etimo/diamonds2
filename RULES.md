# How to play

You play the game using a bot and controlling it using our API. A bot can be registered through the API and reused multiple times to play multiple sessions.

The purpose of the game is to collect as many diamonds as possible and deliver them to the base within a specific time. Each diamond delivered to the base gives you points and the bot with the best highscore wins. The bot only carry some diamonds at a time and must deliver the diamonds continuously back to the base to exchange them for points.

Feel free to solve the problem in whatever way you like and be creative. Sometimes it's not a pure algorithm problem, sometimes it is. It all depends on the active rules.

## In a nutshell

The steps and flow to play the game look like this:

1. **Register a bot** - (if you haven't already) using the [`POST /bots`](http://localhost:8081/docs#/Bots/BotsController_create) endpoint. This endpoint will return a secret token that is used in all requests when playing the game. Make sure to supply a correct email so we can contact you if you are among the winners!
2. **Check the available boards** - to find a suitable one to join using the [`GET /boards`](http://localhost:8081/docs#/Boards/BoardsController_findAll) endpoint.
3. **Join a board** - using the [`POST /bots/:botId/join`](http://localhost:8081/docs#/Bots/BotsController_join). You can supply a suggested board id for the board that you want to join but depending on 1) the rules or 2) the capacity of the board you might be placed on another board. The actual board that you are placed on is returned in the response using the `id` field.
4. **Move your bot** - using the board state from either the join response (or polling the [`GET /boards/:boardId`](http://localhost:8081/docs#/Boards/BoardsController_find) endpoint), calculate where you want the bot to go and send a request to the [`POST /bots/:botId/move`](http://localhost:8081/docs#/Bots/BotsController_move) endpoint. You can only move one step at a time.
5. **Rinse and repeat** - all actions will return a new board state. Continue calculating the next step using that state and so on until the time runs out. When the time runs out your current play session is finished and your score is updated in the highscore.
6. **Play multiple times** - continue playing to maximize the chances of increasing your score. You can play as many times as you wish using the same bot.

# Rules

There are sometimes multiple boards available. Also different boards could have different configurations and features available. To check which boards are available and their configurations you can use the api call `GET /api/boards`. This will return an array of all available boards. Explore the return value and the configurations and see what you can find! Some of the configuration values are explained in the rules below as well.

## Board configurations, a.k.a. "features"

Each board has some metadata (the `features` field in the response) describing the features that are enabled on that board along with the settings for those features. This can be used to determine the strategy that you want to utilize.

### Red button / Diamond button - `DiamondButtonProvider`

The red button triggers a regeneration of all diamonds on the board when stepped on. When new diamonds are generated the red button will also be regenerated.

The diamond button is enabled by the feature `DiamondButtonProvider` in the board configuration.

### Diamonds - `DiamondProvider`

Diamonds will respawn whenever depleted. Red diamonds count as 2 diamonds (and take up 2 spaces in your inventory) so they are twice as valuable as blue diamonds. The ratio between red and blue diamonds changes on each regeneration.

The diamonds are enabled by the feature `DiamondProvider` in the board configuration.

### Teleporters - `TeleportProvider`

The multi-colored discs are teleporters. When entering a cell with a teleporter you will automatically be transferred to the other teleporter with the same `pairId`.

### Teleporters relocation - `TeleportRelocationProvider`

This features makes it so that teleporters are relocated to different cells at certain intervals.

### Bots and bases - `BotProvider` and `BaseProvider`

All bots will have a home base with their name on. This is where you have to go to drop off the diamonds you are carrying.

## Season configuration

Each season has a configuration describing all the rules, both for the features and providers described above but also regarding the overall rules of the game. The rule configuration can be found using the [`GET /seasons/rules/:id`](http://localhost:8081/docs#/Seasons/SeasonsController_getCurrentSeasonRules) endpoint.

### Tackle - `canTackle`

Bots can tackle each other. If bot A tackles bot B (walk into bot B's position) bot B will be sent to its base and lose all diamonds. Bot A will receive bot B's diamonds.

### Inventory size - `inventorySize`

The maximum amount of points/diamonds a bot can carry at the same time.

### Teleporters - `teleporters`

The number of teleporters available on boards.

### Teleport relocation interval - `teleportRelocation`

The number of seconds between each relocation of teleporters.

### Width and height - `width` and `height`

The base size of each board.

### Minimum delay between moves - `minimumDelayBetweenMoves`

The minimum number of milliseconds that a bot will have to wait before performing its next move. If you exceed this you will eventually be kicked out of the game. This is basically a rate limit.

### Session length - `sessionLength`

The number of seconds each play session lasts.

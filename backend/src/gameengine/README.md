# Game engine

The game engine is designed around some kind of mediator-like pattern.

# Run an example instance of the game using the cli

Having `ts-node` in the path:

```
ts-node cli-example.ts
```

Otherwise something like this from the project root:

```
./node_modules/.bin/ts-node src/gameengine/cli-example.ts
```

This implementation outputs the board to the console and plays using an example bot.

## Game object providers

Game object providers react to events around the board itself, such as when a board is initialized and when objects are added or removed.

All providers must inherit the abstract class `AbstractGameObjectProvider`.

Available events to override:
* *onBoardInitialized* - A board is initialized
* *onBotJoined* - A bot joins
* *onBotFinished* - A bot's timer ends
* *onGameObjectsRemoved* - One or more game objects was removed from the board
* *onGameObjectsAdded* - One or more game objects was added to the board

Providers are mainly responsible for spawning/removing game objects.

Examples:
* When a board is initialized, generate a set of diamond game objects that can be collected.
* When diamonds are depleted, generate new ones.

## Game objects

Game objects are the actual objects placed on the board. Game objects have a position, they can be acted upon, they can collide, they can react to other game objects etc.

All game objects perform actions using the assigned board as the mediator.

All game objects must inherit the abstract class `AbstractGameObject`.

Available events:
* *canGameObjectEnter* - Another game object wants to move to the cell that this game object belongs to
* *onGameObjectEntered* - Another game object moved to the cell of this game object
* *canGameObjectLeave* - Another game object wants to leave the cell that this game object belongs to
* *onGameObjectLeft* - Another game object left the cell of this game object
* *onGameObjectCallbackNotified* - Callback for when a certain time has passed. Use to perform periodic activity. Requires telling the board to you notify you every X ms (`registerGameObjectForCallbackLoop(gameObject: AbstractGameObject, interval: number)`)
* *onGameObjectRemoved* - This game object was removed from the board
* *onEvent* - Some kind of other event was published from a game object

### Available game objects

These are the game objects currently sort of implemented (not fully tested yet though :). They have a provider as well.

* [Base](gameobjects/base/)
* [Bot](gameobjects/bot/)
* [Diamond](gameobjects/diamond/)
* [Diamond button](gameobjects/diamond-button/)
* [Dummy bot](gameobjects/dummy-bot/)
* [Teleport](gameobjects/teleport/)


## Boards

A board is created using a configuration and a set of game object providers ("Features"). This makes it easy to create different boards with different features activated.

```typescript
const providers = [
    new DiamondButtonProvider(),
    new BaseProvider(),
    new DiamondProvider(),
    new BotProvider(),
    new DummyBotProvider()
];
const config: BoardConfig = {
    diamondsGenerationRatio: 0.1,
    height: 10,
    width: 10,
    minimumDelayBetweenMoves: 100,
    maxCarryingDiamonds: 5
};
const board = new Board(config, providers, log);
```

Perhaps a board with only bots and diamonds:
```typescript
const providers = [
    new BaseProvider(),
    new DiamondProvider(),
    new BotProvider(),
];
const config: BoardConfig = {
    diamondsGenerationRatio: 0.1,
    height: 10,
    width: 10,
    minimumDelayBetweenMoves: 100,
    maxCarryingDiamonds: 5
};
const board = new Board(config, providers, log);
```
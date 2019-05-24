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


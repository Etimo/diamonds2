# Game engine

The game engine is designed around some kind of mediator-like pattern.

## Game object providers

Game object providers react to events around the board itself, such as when a board is initialized and when objects are added or removed.

All providers must inherit the abstract class `AbstractGameObjectProvider`.

Available events to override:
* onBoardInitialized
* onBotJoined
* onBotFinished
* onGameObjectsRemoved
* onGameObjectsAdded

Providers are mainly responsible for spawning/removing game objects.

Examples:
* When a board is initialized, generate a set of diamond game objects that can be collected.
* When diamonds are depleted, generate new ones.

## Game objects

Game objects are the actual objects placed on the board. Game objects have a position, they can be acted upon, they can collide, they can react to other game objects etc.

All game objects perform actions using the assigned board as the mediator.

All game objects must inherit the abstract class `AbstractGameObject`.

Available events:
* canGameObjectEnter
* onGameObjectEntered
* canGameObjectLeave
* onGameObjectLeft
* onGameObjectCallbackNotified
* onGameObjectRemoved
* onEvent


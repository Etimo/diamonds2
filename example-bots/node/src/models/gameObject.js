export class GameObject {
  constructor(id, position, type, properties) {
    this.id = id;
    this.position = position;
    this.type = type;
    this.properties = properties;
  }

  static dataToListOfGameObjects(gameObjects) {
    return gameObjects.map((go) => {
      return new GameObject(go.id, go.position, go.type, go.properties);
    });
  }
}

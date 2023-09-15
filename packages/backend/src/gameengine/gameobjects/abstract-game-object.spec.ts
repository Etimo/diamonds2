import { AbstractGameObject } from "./abstract-game-object";

let go: AbstractGameObject;

// We need something to instantiate since this is an abstract class
class DummyObject extends AbstractGameObject {
  constructor() {
    super({ x: 1, y: 2 });
  }
}

beforeEach(() => {
  go = new DummyObject();
});

test("x property returns x position", () => {
  expect(go.x).toBe(1);
});

test("y property returns y position", () => {
  expect(go.y).toBe(2);
});

test("id property returns an id", () => {
  expect(go.id).toBeDefined();
});

test("position property returns position", () => {
  expect(go.position).toEqual({ x: 1, y: 2 });
});

test("ids are unique for each instantiated object", () => {
  const a = new DummyObject();
  const b = new DummyObject();

  expect(a.id).not.toBe(b.id);
});

describe("multiple positions", () => {
  test("previous position returns null if there is none", () => {
    expect(go.previousPosition).toBeNull();
  });

  test("previous position returns previous position if there is one", () => {
    go.position = { x: 2, y: 4 };

    expect(go.previousPosition).toEqual({ x: 1, y: 2 });
  });

  test("previous position returns most recent previous position if there are more", () => {
    go.position = { x: 2, y: 4 };
    go.position = { x: 3, y: 5 };

    expect(go.previousPosition).toEqual({ x: 2, y: 4 });
  });

  test("clearPositions position discards old positions", () => {
    go.position = { x: 2, y: 4 };
    go.position = { x: 3, y: 5 };

    go.clearPositions();

    expect(go.previousPosition).toBeNull();
  });
});

test("has null properties by default", () => {
  expect(go.properties).toBeNull();
});

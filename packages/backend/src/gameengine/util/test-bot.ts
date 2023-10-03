import { BotGameObject } from "../gameobjects";

// TODO: It could be nice to add memoization here to avoid same ID for bots.
export function createTestBot(): BotGameObject {
  return new BotGameObject({
    base: { x: 0, y: 0 },
    diamonds: 0,
    timeJoined: new Date(),
    expiresAt: new Date(),
    inventorySize: 5,
    canTackle: true,
    score: 0,
    name: "test",
    nextMoveAvailableAt: new Date(),
    botId: "1",
  });
}

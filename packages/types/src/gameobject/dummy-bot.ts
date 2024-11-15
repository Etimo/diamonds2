import type { BotProviderConfig } from "./bot.ts";

export type DummyBotProviderConfig = {
  /**
   * Number of dummy bots to spawn.
   */
  count: number;
  /**
   * Name prefix
   */
  prefix: string;
} & BotProviderConfig;

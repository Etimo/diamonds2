export type TeleportProperties = {
  pairId: string;
};

export type TeleportProviderConfig = {
  /**
   * The number of pairs of teleporters that will be generated.
   */
  pairs: number;
};

export type TeleportRelocationProviderConfig = {
  /**
   * The number of pairs of teleporters that will be generated.
   */
  seconds: number;
};

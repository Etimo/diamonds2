export type DiamondGameObjectProperties = {
  points: number;
};

export type DiamondProviderConfig = {
  /**
   * The minimum ratio (percent of board size) of diamonds before new ones should be generated.
   */
  minRatioForGeneration: number;
  /**
   * The ratio (percent of board size) of diamonds to generate
   */
  generationRatio: number;
  /**
   * The ratio (percent of total diamonds generated) of diamonds that should be red
   */
  redRatio: number;
};

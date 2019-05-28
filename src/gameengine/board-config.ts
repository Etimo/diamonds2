export interface BoardConfig {
  /**
   * The ratio of diamonds to generate compared to board size. A ratio of 0.1 means 10% of the total board size. Will generate 10 diamonds if the board size is 10x10.
   */
  diamondsGenerationRatio: number;
  /**
   * Maximum number of diamonds that can be carried by a bot at the same time.
   */
  maxCarryingDiamonds: number;
  /**
   * The minimum delay (in milliseconds) between allowed moves per bot.
   */
  minimumDelayBetweenMoves: number;
  /**
   * The width of the board.
   */
  width: number;
  /**
   * The height of the board.
   */
  height: number;
}

export interface BoardConfig {
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
  /**
   * Maximum number of seconds per session.
   */
  sessionLength: number;
}

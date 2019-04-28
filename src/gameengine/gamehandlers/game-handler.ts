export abstract class AbstractGameHandler {
    onBoardInitialized(board: Board) { }
    onBotJoined(bot: IBoardBot, board: Board) { }
    onBotFinished(bot: IBoardBot, board: Board) { }
    onBoardNotified(board: Board) { }

}
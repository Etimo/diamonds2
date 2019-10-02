import { Board } from "src/gameengine/board";
import { IBot } from "src/interfaces/bot.interface";
import { IPosition } from "src/common/interfaces/position.interface";

export class OperationQueueEvent {
    queuedAt = new Date();

    constructor(protected bot: IBot, protected board: Board) {}

    run() {
        throw Error("Not implemented");
    }
}

export class OperationQueueMoveEvent extends OperationQueueEvent {
    constructor(protected bot: IBot, protected board: Board, protected delta: IPosition) {
        super(bot, board);
    }

    run() {
        return this.board.move(this.bot, this.delta)
    }
}

export class OperationQueueJoinEvent extends OperationQueueEvent {
    run() {
        return this.board.join(this.bot);
    }
}
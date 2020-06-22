import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { BoardsService } from "../services/board.service";

@Injectable()
export class AutoScaleMiddleware implements NestMiddleware {
  constructor(
    private boardsService: BoardsService,
    private requestCount: number = 0,
    private controlAt: Date = null,
  ) {
    if (!this.controlAt) {
      this.controlAt = this.setControlAt();
    }
  }

  use(req: Request, res: Response, next: Function): void {
    this.autoScaleBoards();
    next();
  }

  autoScaleBoards(): void {
    if (new Date() >= this.controlAt) {
      const addOrRemoveNumber = this.calculateAddOrRemoval();

      if (addOrRemoveNumber < 0) {
        this.removeBoardIfNoPlayers(addOrRemoveNumber * -1);
      }
      if (addOrRemoveNumber > 0) {
        this.createNewBoard(addOrRemoveNumber);
      }
      this.requestCount = 0;
      this.controlAt = this.setControlAt();
    }

    this.requestCount++;
  }

  setControlAt(): Date {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return new Date(now);
  }

  removeBoardIfNoPlayers(numberOfBoards: number): void {
    this.boardsService.removeEmptyBoards(numberOfBoards);
  }

  createNewBoard(numberOfBoards: number): void {
    this.boardsService.createInMemoryBoard(numberOfBoards);
  }

  calculateAddOrRemoval(): number {
    const currentNumberOfBoards = this.boardsService.getAll().length;
    let futureNumberOfBoards = 0;

    // Default number of boards is 4.
    if (this.requestCount < 4800) {
      futureNumberOfBoards = 4;
    } else {
      // 1 board/1200 requests. Round off to next integer.
      futureNumberOfBoards = Math.ceil(this.requestCount / 1200);
    }

    return futureNumberOfBoards - currentNumberOfBoards;
  }
}

import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { BoardsService } from "../services/board.service";

@Injectable()
export class AutoScaleMiddleware implements NestMiddleware {
  private requestCount: number = 0;
  private controlAt: Date = new Date(Date.now() + 1 * 60 * 1000);
  constructor(private boardsService: BoardsService) {}

  async use(req: Request, res: Response, next: Function): Promise<void> {
    await this.autoScaleBoards();
    next();
  }

  async autoScaleBoards(): Promise<void> {
    if (new Date() >= this.controlAt) {
      const addOrRemoveNumber = this.calculateAddOrRemoval();
      if (addOrRemoveNumber < 0) {
        this.removeBoardsIfNoPlayers(addOrRemoveNumber * -1);
      }
      if (addOrRemoveNumber > 0) {
        await this.createNewBoards(addOrRemoveNumber);
      }
      this.requestCount = 0;
      this.setControlAt(1);
    }
    this.requestCount++;
  }

  setControlAt(minutes: number): void {
    // Control requestCount every X minute
    // (-minutes can be used during test cases to trigger autoScaleBoards)
    this.controlAt = new Date(Date.now() + minutes * 60 * 1000);
  }

  removeBoardsIfNoPlayers(numberOfBoards: number): void {
    this.boardsService.removeEmptyBoards(numberOfBoards);
  }

  async createNewBoards(numberOfBoards: number): Promise<void> {
    await this.boardsService.createInMemoryBoards(numberOfBoards);
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
  // Using this to mock during tests
  setRequestCount(requests: number): void {
    this.requestCount = requests;
  }
}

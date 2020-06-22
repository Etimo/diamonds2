import { Request, Response } from "express";
import { BoardsService } from "../services/board.service";
import { Board } from "src/gameengine/board";

let requestCount = 0;
let controlAt = null;

export function autoscaleBoards(req: Request, res: Response, next: Function) {
  if (!controlAt) {
    setControlAt();
  }

  if (new Date() >= controlAt) {
    // Scale boards
    requestCount = 0;
    setControlAt();
  }

  requestCount++;
  next();
}

const setControlAt = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 1);
  controlAt = new Date(now);
};

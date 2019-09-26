import { Injectable } from "@nestjs/common";
import { BoardsService } from "src/services/board/board.service";

@Injectable()
export class GameService {
  constructor(private boardService: BoardsService) {}
}

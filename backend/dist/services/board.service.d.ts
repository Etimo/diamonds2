import { CustomLogger } from "src/logger";
import { BoardDto } from "src/models/board.dto";
import { BotsService } from "./bots.service";
import { MoveDirection } from "src/enums/move-direction.enum";
import { HighScoresService } from "./high-scores.service";
export declare class BoardsService {
    private botsService;
    private highscoresService;
    private logger;
    private boards;
    constructor(botsService: BotsService, highscoresService: HighScoresService, logger: CustomLogger);
    getAll(): BoardDto[];
    getById(id: string): BoardDto;
    join(boardId: string, botToken: string): Promise<boolean>;
    move(boardId: string, botToken: string, direction: MoveDirection): Promise<boolean>;
    private getBoardById;
    private directionToDelta;
    private getAsDto;
    private createInMemoryBoard;
}

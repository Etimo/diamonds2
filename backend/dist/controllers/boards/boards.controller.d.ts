import { BoardDto } from "src/models/board.dto";
import { BoardsService } from "src/services/board.service";
import { JoinInputDto } from "src/models/join-input.dto";
import { MoveInputDto } from "src/models/move-input.dto";
export declare class BoardsController {
    private boardsService;
    constructor(boardsService: BoardsService);
    findAll(): BoardDto[];
    find(id: string): BoardDto;
    join(id: string, input: JoinInputDto): Promise<boolean>;
    move(id: string, input: MoveInputDto): Promise<boolean>;
}

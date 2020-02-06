import { HighscoreDto } from "src/models/highscore.dto";
import { HighScoresService } from "src/services/high-scores.service";
export declare class HighscoresController {
    private highScoresService;
    constructor(highScoresService: HighScoresService);
    listAll(): Promise<HighscoreDto[]>;
}

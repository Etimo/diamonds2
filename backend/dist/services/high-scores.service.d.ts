import { IdService } from "./id.service";
import { HighscoreDto } from "src/models/highscore.dto";
export declare class HighScoresService {
    private readonly idService;
    private highScores;
    constructor(idService: IdService);
    addOrUpdate(input: HighscoreDto): Promise<boolean>;
    private isNewHighScore;
    private updateHighScore;
    all(): HighscoreDto[];
}

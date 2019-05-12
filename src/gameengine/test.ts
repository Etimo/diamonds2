import { Board } from './board';
import { BoardConfig } from './board-config';

const providers = [];
const config: BoardConfig = {
    diamondsGenerationRatio: 0.1,
    height: 10,
    width: 10,
    minimumMoveDelayMs: 100,
    maxCarryingDiamonds: 5
};
const board = new Board(config, []);
console.log(board.toString());

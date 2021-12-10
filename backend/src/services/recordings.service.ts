import { Injectable } from "@nestjs/common";
import { CustomLogger } from "../logger";
import { RecordingListDto } from "../models/recording-list.dto";
import { RecordingPublicDto } from "../models/recording-public.dto";
import NotFoundError from "../errors/not-found.error";
import { RecordingsRepository } from "../db/repositories/recordings.repository";

@Injectable()
export class RecordingsService {
  private states: Array<Array<Object>> = [];
  private stateIndex: number[] = [];

  constructor(
    private readonly repo: RecordingsRepository,
    private logger: CustomLogger,
  ) {}

  setup(numberOfBoards: number, numberOfStates: number) {
    this.logger.info(
      `Setting up state recorder for ${numberOfBoards} boards with ${numberOfStates} states`,
    );
    this.states = new Array(numberOfBoards).fill(null).map(_ => {
      const arr = new Array(numberOfStates).fill(null);
      Object.seal(arr);
      return arr;
    });
    this.stateIndex = new Array(numberOfBoards).fill(0);
  }

  record(boardIndex: number, state: Object) {
    const arr = this.states[boardIndex];
    arr[this.stateIndex[boardIndex]] = state;
    this.stateIndex[boardIndex] =
      (this.stateIndex[boardIndex] + 1) % this.states[boardIndex].length;
  }

  public getRecording(boardIndex: number): Array<Object> {
    const currentStateIndex = this.stateIndex[boardIndex];
    const states = this.states[boardIndex];

    return new Array(states.length)
      .fill(0)
      .map((_, index) => states[(currentStateIndex + index) % states.length])
      .filter(r => r);
  }

  async save({
    boardIndex,
    botName,
    score,
    seasonId,
  }: {
    boardIndex: number;
    botName: string;
    score: number;
    seasonId: string;
  }) {
    this.logger.debug(
      `Saving new recording for ${botName} with score ${score}`,
    );
    await this.repo.create({
      botName,
      score,
      board: boardIndex,
      seasonId,
      recording: JSON.stringify(this.getRecording(boardIndex)),
    });
    await this.repo.purgeOld(seasonId);
  }

  public async allBySeasonIdList(
    seasonId: string,
  ): Promise<RecordingListDto[]> {
    const data = await this.repo.allBySeasonIdRaw(seasonId);
    if (data.length === 0) {
      throw new NotFoundError("Season not found");
    }
    return data.map(e => RecordingListDto.fromRawDataObject(e));
  }

  public async getById(
    seasonId: string,
    id: string,
  ): Promise<RecordingPublicDto> {
    const data = await this.repo.getById(seasonId, id);
    if (data.length === 0) {
      throw new NotFoundError("Data not found");
    }
    return data.map(e => RecordingPublicDto.fromRawDataObject(e))[0];
  }
}

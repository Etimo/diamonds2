import { Injectable } from "@nestjs/common";
import { RecordingsRepository } from "../db";
import { NotFoundError } from "../errors";
import { CustomLogger } from "../logger";
import { RecordingListDto, RecordingPublicDto } from "../models";
import { ISaveRecording } from "../types";

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
    this.states = new Array(numberOfBoards).fill(null).map((_) => {
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
      .filter((r) => r);
  }

  async save(data: ISaveRecording) {
    this.logger.debug(
      `Saving new recording for ${data.botId} with score ${data.score}`,
    );

    await this.repo.create({
      ...data,
      recording: JSON.stringify(this.getRecording(data.board)),
    });
    await this.purgeOld(data.seasonId);
  }

  public async allBySeasonIdList(
    seasonId: string,
  ): Promise<RecordingListDto[]> {
    const data = await this.repo.allBySeasonIdRaw(seasonId);
    if (data.length === 0) {
      throw new NotFoundError("Season not found");
    }
    return data.map((e) => ({
      board: e.board,
      botName: "",
      created: e.createTimeStamp,
      recordingId: e.id,
      score: e.score,
    }));
  }

  public async getById(id: string): Promise<RecordingPublicDto> {
    const data = await this.repo.getById(id);
    if (data.length === 0) {
      throw new NotFoundError("Data not found");
    }
    return data.map(
      (e) =>
        ({
          board: e.board,
          botName: "",
          created: e.createTimeStamp,
          recording: e.recording,
          score: e.score,
          seasonId: e.seasonId,
        }) as RecordingPublicDto,
    )[0];
  }

  public async purgeOld(seasonId: string) {
    const maxEntries = 10;
    const existing = await this.repo.getScores(seasonId, maxEntries + 1);

    if (existing.length > maxEntries) {
      // Remove if we have more than 10 recordings
      await this.repo.deleteRecordingsWithLowScore(
        seasonId,
        existing[maxEntries - 1],
      );
    }
  }
}

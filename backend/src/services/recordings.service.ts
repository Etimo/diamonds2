import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RecordingsEntity } from "../db/models/recordings.entity";
import { CustomLogger } from "../logger";
import { RecordingListDto } from "../models/recording-list.dto";
import { RecordingPublicDto } from "../models/recording-public.dto";
import { RecordingDto } from "../models/recording.dto";
import { LessThan, Repository } from "typeorm";
import NotFoundError from "../errors/not-found.error";

@Injectable()
export class RecordingsService {
  private states: Array<Array<Object>> = [];
  private stateIndex: number[] = [];
  private entity: string = "recordings";

  constructor(
    @InjectRepository(RecordingsEntity)
    private readonly repo: Repository<RecordingsEntity>,
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
    await this.create({
      botName,
      score,
      board: boardIndex,
      seasonId,
      recording: JSON.stringify(this.getRecording(boardIndex)),
    });
    await this.purgeOld(seasonId);
  }

  private async purgeOld(seasonId: string) {
    const maxEntries = 10;
    const existing = await this.repo
      .createQueryBuilder(this.entity)
      .select(["recordings.score"])
      .where("recordings.seasonId = :seasonId", { seasonId })
      .orderBy("score", "DESC")
      .limit(maxEntries + 1)
      .execute();

    if (existing.length > maxEntries) {
      // Remove if we have more than 10 recordings
      this.logger.info("Removing old recordings");
      await this.repo
        .createQueryBuilder()
        .delete()
        .from(RecordingsEntity)
        .where({
          seasonId,
          score: LessThan(existing[maxEntries - 1]["recordings_score"]),
        })
        .execute();
    }
  }

  private async create(dto: RecordingDto) {
    await this.repo.save(dto);
  }

  private async allBySeasonIdRaw(seasonId: string, limit: number = 0) {
    return await this.repo
      .createQueryBuilder(this.entity)
      .select(this.entity)
      .where("recordings.seasonId = :seasonId", { seasonId })
      .orderBy("score", "DESC")
      .limit(limit)
      .execute();
  }

  public async allBySeasonIdList(
    seasonId: string,
  ): Promise<RecordingListDto[]> {
    const data = await this.allBySeasonIdRaw(seasonId);
    if (data.length === 0) {
      throw new NotFoundError("Season not found");
    }
    return data.map(e => RecordingListDto.fromRawDataObject(e));
  }

  public async getById(
    seasonId: string,
    id: string,
  ): Promise<RecordingPublicDto> {
    const data = await this.repo
      .createQueryBuilder(this.entity)
      .select(this.entity)
      .where("recordings.seasonId = :seasonId AND recordings.id = :id", {
        seasonId,
        id,
      })
      .execute();
    if (data.length === 0) {
      throw new NotFoundError("Data not found");
    }
    return data.map(e => RecordingPublicDto.fromRawDataObject(e))[0];
  }
}

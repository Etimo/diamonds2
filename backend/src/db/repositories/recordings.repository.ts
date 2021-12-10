import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RecordingDto } from "../../models/recording.dto";
import { LessThan, Repository } from "typeorm";
import { RecordingsEntity } from "../models/recordings.entity";

@Injectable()
export class RecordingsRepository {
  private entity: string = "recordings";

  constructor(
    @InjectRepository(RecordingsEntity)
    private readonly repo: Repository<RecordingsEntity>,
  ) {}

  public async allBySeasonIdRaw(seasonId: string, limit: number = 0) {
    return await this.repo
      .createQueryBuilder(this.entity)
      .select(this.entity)
      .where("recordings.seasonId = :seasonId", { seasonId })
      .orderBy("score", "DESC")
      .limit(limit)
      .execute();
  }

  public async create(dto: RecordingDto): Promise<RecordingsEntity> {
    return await this.repo.save(dto);
  }

  public async purgeOld(seasonId: string) {
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

  public async getById(seasonId: string, id: string): Promise<Object[]> {
    return await this.repo
      .createQueryBuilder(this.entity)
      .select(this.entity)
      .where("recordings.seasonId = :seasonId AND recordings.id = :id", {
        seasonId,
        id,
      })
      .execute();
  }
}

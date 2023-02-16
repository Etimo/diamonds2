import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RecordingDto } from "../../models/recording.dto";
import { LessThan, Repository } from "typeorm";
import { RecordingsEntity } from "../models/recordings.entity";
import { PrismaService } from "../../services/prisma.service";

@Injectable()
export class RecordingsRepository {
  private entity: string = "recordings";

  constructor(private prisma: PrismaService) {}

  public async allBySeasonIdRaw(seasonId: string, limit: number = 0) {
    return this.prisma.recording.findMany({
      where: {
        seasonId,
      },
      take: limit,
    });
    // return await this.repo
    //   .createQueryBuilder(this.entity)
    //   .select(this.entity)
    //   .where("recordings.seasonId = :seasonId", { seasonId })
    //   .orderBy("score", "DESC")
    //   .limit(limit)
    //   .execute();
  }

  public async create(dto: RecordingDto) {
    return this.prisma.recording.create({
      data: {
        board: dto.board,
        score: dto.score,
        seasonId: dto.seasonId,
        recording: dto.recording,
      },
    });
    // return await this.repo.save(dto);
  }

  public async purgeOld(seasonId: string) {
    const maxEntries = 10;
    const existing = await this.prisma.recording.findMany({
      select: {
        score: true,
      },
      where: {
        seasonId,
      },
      orderBy: {
        score: "desc",
      },
      take: maxEntries + 1,
    });
    // const existing = await this.repo
    //   .createQueryBuilder(this.entity)
    //   .select(["recordings.score"])
    //   .where("recordings.seasonId = :seasonId", { seasonId })
    //   .orderBy("score", "DESC")
    //   .limit(maxEntries + 1)
    //   .execute();

    if (existing.length > maxEntries) {
      // Remove if we have more than 10 recordings
      await this.prisma.recording.deleteMany({
        where: {
          seasonId,
          score: {
            lt: existing[maxEntries - 1].score,
          },
        },
      });
      // await this.repo
      //   .createQueryBuilder()
      //   .delete()
      //   .from(RecordingsEntity)
      //   .where({
      //     seasonId,
      //     score: LessThan(existing[maxEntries - 1]["recordings_score"]),
      //   })
      //   .execute();
    }
  }

  public async getById(seasonId: string, id: string) {
    return this.prisma.recording.findMany({
      where: {
        seasonId,
        id,
      },
    });
    // return await this.repo
    //   .createQueryBuilder(this.entity)
    //   .select(this.entity)
    //   .where("recordings.seasonId = :seasonId AND recordings.id = :id", {
    //     seasonId,
    //     id,
    //   })
    //   .execute();
  }
}

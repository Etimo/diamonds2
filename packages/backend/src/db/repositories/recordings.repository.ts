import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";
import { INewRecording, IRecording } from "../../types";

@Injectable()
export class RecordingsRepository {
  constructor(private prisma: PrismaService) {}

  public async allBySeasonIdRaw(seasonId: string, limit: number = 0) {
    return this.prisma.recording.findMany({
      where: {
        seasonId,
      },
      take: limit,
    });
  }

  public async create(data: INewRecording): Promise<IRecording> {
    return this.prisma.recording.create({
      data,
    });
  }

  public async getById(id: string) {
    return this.prisma.recording.findMany({
      where: {
        id,
      },
    });
  }

  public async getScores(
    seasonId: string,
    maxEntries: number,
  ): Promise<number[]> {
    const recordings = await this.prisma.recording.findMany({
      select: {
        score: true,
      },
      where: {
        seasonId,
      },
      orderBy: {
        score: "desc",
      },
      take: maxEntries,
    });

    return recordings.map((e) => e.score);
  }

  public async deleteRecordingsWithLowScore(
    seasonId: string,
    higestScore: number,
  ) {
    await this.prisma.recording.deleteMany({
      where: {
        seasonId,
        score: {
          lt: higestScore,
        },
      },
    });
  }
}

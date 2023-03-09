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

  public async purgeOld(seasonId: string) {
    //TODO: Move logic to a service. //Klara
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
    }
  }

  public async getById(id: string) {
    return this.prisma.recording.findMany({
      where: {
        id,
      },
    });
  }
}

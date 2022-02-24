import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BoardConfigDto } from "../../models/board-config.dto";
import { BoardConfigEntity } from "../models/boardConfig.entity";

@Injectable()
export class BoardConfigRepository {
  constructor(
    @InjectRepository(BoardConfigEntity)
    private readonly repo: Repository<BoardConfigEntity>,
  ) {}

  public async getForSeason(seasonId: string): Promise<BoardConfigEntity> {
    return this.repo
      .createQueryBuilder("board_config")
      .where("board_config.seasonId = :seasonId", {
        seasonId,
      })
      .getOne();
  }

  public async create(dto: BoardConfigDto): Promise<BoardConfigEntity> {
    return await this.repo.save(dto);
  }
}

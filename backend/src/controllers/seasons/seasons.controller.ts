import { Controller, Get, Body, Post, Param } from "@nestjs/common";
import { ApiUseTags, ApiResponse } from "@nestjs/swagger";
import { BoardConfigDto } from "src/models/board-config.dto";
import { SeasonDto } from "src/models/season.dto";
import { BoardConfigService } from "src/services/board-config.service";
import { SeasonsService } from "src/services/seasons.service";

@ApiUseTags("Seasons")
@Controller("api/seasons")
export class SeasonsController {
  constructor(
    private seasonsService: SeasonsService,
    private boardConfigService: BoardConfigService,
  ) {}

  @ApiResponse({
    status: 200,
    description: "Returns seasons",
    isArray: true,
    type: SeasonDto,
  })
  @Get()
  async listAll(): Promise<SeasonDto[]> {
    return this.seasonsService.all();
  }

  @Get("/current")
  async getCurrentSeason(): Promise<SeasonDto> {
    return this.seasonsService.getCurrentSeason();
  }

  @Get("/rules/:id")
  async getCurrentSeasonRules(
    @Param("id") id: string,
  ): Promise<BoardConfigDto> {
    return this.boardConfigService.getBoardConfig(id);
  }
}

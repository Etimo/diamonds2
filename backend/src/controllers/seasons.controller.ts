import { Controller, Get, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { BoardConfigDto } from "src/models/board-config.dto";
import { SeasonDto } from "src/models/season.dto";
import { BoardConfigService } from "src/services/board-config.service";
import { SeasonsService } from "src/services/seasons.service";

@ApiTags("Seasons")
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

  @ApiResponse({
    status: 200,
    description: "Returns current season",
    type: SeasonDto,
  })
  @Get("/current")
  async getCurrentSeason(): Promise<SeasonDto> {
    const season = await this.seasonsService.getCurrentSeason();
    return SeasonDto.fromEntity(season);
  }

  @ApiResponse({
    status: 200,
    description: "Returns rules for season",
    type: BoardConfigDto,
  })
  @Get("/rules/:id")
  async getCurrentSeasonRules(
    @Param("id") id: string,
  ): Promise<BoardConfigDto> {
    const season = await this.seasonsService.getCurrentSeason();
    return BoardConfigDto.fromSeasonWithBoardConfig(season);
  }
}

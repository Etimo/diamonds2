import { Controller, Get, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { BoardConfigDto, SeasonDto } from "../models";
import { BoardConfigService, SeasonsService } from "../services";

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
    const seasons = await this.seasonsService.all();
    return seasons.map((season) => SeasonDto.fromEntity(season));
  }

  @ApiResponse({
    status: 200,
    description: "Returns current season",
    type: SeasonDto,
  })
  @Get("/current")
  async getCurrentSeason(): Promise<SeasonDto> {
    const season = await this.seasonsService.getCurrentSeason();
    return SeasonDto.fromEntity(season!);
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
    return BoardConfigDto.fromSeasonWithBoardConfig(season!);
  }
}

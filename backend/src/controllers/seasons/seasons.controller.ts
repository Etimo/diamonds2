import { Controller, Get, Body, Post } from "@nestjs/common";
import { ApiUseTags, ApiResponse } from "@nestjs/swagger";
import { SeasonDto } from "src/models/season.dto";
import { SeasonsService } from "src/services/seasons.service";

@ApiUseTags("Seasons")
@Controller("api/seasons")
export class SeasonsController {
  constructor(private seasonsService: SeasonsService) {}

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
}

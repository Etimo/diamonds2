import { Controller, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { TeamDto } from "../models";
import { TeamsService } from "../services";

@ApiTags("Teams")
@Controller("api/teams")
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @ApiResponse({
    status: 200,
    description: "Returns a list of all teams",
    isArray: true,
    type: TeamDto,
  })
  @Get()
  async listAll(): Promise<TeamDto[]> {
    const teams = await this.teamsService.all();
    return teams.map((team) => TeamDto.fromEntity(team));
  }
}

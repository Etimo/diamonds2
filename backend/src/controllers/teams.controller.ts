import { Controller, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { TeamDto } from "src/models/team.dto";
import { TeamsService } from "src/services/teams.service";

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

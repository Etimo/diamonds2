import { Controller, Get, Body, Post } from "@nestjs/common";
import { ApiUseTags, ApiResponse } from "@nestjs/swagger";
import { TeamDto } from "src/models/team.dto";
import { TeamsService } from "src/services/teams.service";

@ApiUseTags("Teams")
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
    return this.teamsService.all();
  }
}

import { ITeamDto } from "@etimo/diamonds2-types";
import { ApiProperty } from "@nestjs/swagger";
import { ITeam } from "../types";

export class TeamDto implements ITeamDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;
  @ApiProperty()
  abbreviation!: string;
  @ApiProperty()
  logotypeUrl!: string;

  public static from(dto: TeamDto) {
    const teamObj = new TeamDto();
    teamObj.id = dto.id;
    teamObj.name = dto.name;
    teamObj.abbreviation = dto.abbreviation;
    teamObj.logotypeUrl = dto.logotypeUrl;
    return teamObj;
  }

  public static create(dto: TeamDto) {
    // Create team dto with no id!
    const teamObj = new TeamDto();
    teamObj.name = dto.name;
    teamObj.abbreviation = dto.abbreviation;
    teamObj.logotypeUrl = dto.logotypeUrl;
    return teamObj;
  }

  public static fromEntity(entity: ITeam) {
    return this.from({
      id: entity.id,
      name: entity.name,
      abbreviation: entity.abbreviation,
      logotypeUrl: entity.logotypeUrl,
    });
  }
}

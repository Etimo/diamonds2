import { ApiProperty } from "@nestjs/swagger";
import { TeamsEntity } from "../db/models/teams.entity";

export class TeamDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  abbreviation: string;
  @ApiProperty()
  logotypeUrl: string;

  public static from(dto: Partial<TeamDto>) {
    const teamObj = new TeamDto();
    teamObj.id = dto.id;
    teamObj.name = dto.name;
    teamObj.abbreviation = dto.abbreviation;
    teamObj.logotypeUrl = dto.logotypeUrl;
    return teamObj;
  }

  public static create(dto: Partial<TeamDto>) {
    // Create team dto with no id!
    const teamObj = new TeamDto();
    teamObj.name = dto.name;
    teamObj.abbreviation = dto.abbreviation;
    teamObj.logotypeUrl = dto.logotypeUrl;
    return teamObj;
  }

  public static fromEntity(entity: TeamsEntity) {
    return this.from({
      id: entity.id,
      name: entity.name,
      abbreviation: entity.abbreviation,
      logotypeUrl: entity.logotypeUrl,
    });
  }
}

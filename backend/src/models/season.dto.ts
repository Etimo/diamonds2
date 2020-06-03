import { ApiModelProperty } from "@nestjs/swagger";
import { SeasonsEntity } from "../db/models/seasons.entity";

export class SeasonDto {
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  startDate: Date;
  @ApiModelProperty()
  endDate: Date;

  public static from(dto: Partial<SeasonDto>) {
    const seasonObj = new SeasonDto();
    seasonObj.name = dto.name;
    seasonObj.startDate = dto.startDate;
    seasonObj.endDate = dto.endDate;
    return seasonObj;
  }

  public static fromEntity(entity: SeasonsEntity) {
    return this.from({
      name: entity.name,
      startDate: entity.startDate,
      endDate: entity.endDate,
    });
  }

  public static offSeason() {
    const seasonObj = new SeasonDto();
    seasonObj.name = "Off Season";
    seasonObj.startDate = new Date();
    seasonObj.endDate = new Date();
    return seasonObj;
  }
}
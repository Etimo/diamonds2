import { ApiModelProperty } from "@nestjs/swagger";
import { SeasonsEntity } from "../db/models/seasons.entity";

export class SeasonDto {
  @ApiModelProperty()
  id: string;
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  startDate: Date;
  @ApiModelProperty()
  endDate: Date;

  public static from(dto: Partial<SeasonDto>) {
    const seasonObj = new SeasonDto();
    seasonObj.id = dto.id;
    seasonObj.name = dto.name;
    seasonObj.startDate = dto.startDate;
    seasonObj.endDate = dto.endDate;
    return seasonObj;
  }

  public static create(dto: Partial<SeasonDto>) {
    // Create season dto with no id!
    const seasonObj = new SeasonDto();
    seasonObj.name = dto.name;
    seasonObj.startDate = dto.startDate;
    seasonObj.endDate = dto.endDate;
    return seasonObj;
  }

  public static fromEntity(entity: SeasonsEntity) {
    return this.from({
      id: entity.id,
      name: entity.name,
      startDate: entity.startDate,
      endDate: entity.endDate,
    });
  }
}

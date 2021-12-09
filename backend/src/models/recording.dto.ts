import { ApiModelProperty } from "@nestjs/swagger";
import { RecordingsEntity } from "src/db/models/recordings.entity";
import { HighScoreEntity } from "../db/models/highScores.entity";

export class RecordingDto {
  @ApiModelProperty()
  botName: string;
  @ApiModelProperty()
  score: number;
  @ApiModelProperty()
  board: number;
  @ApiModelProperty()
  seasonId: string;
  @ApiModelProperty()
  recording: string;

  public static from(dto: Partial<RecordingDto>) {
    const recordingObj = new RecordingDto();
    recordingObj.botName = dto.botName;
    recordingObj.score = dto.score;
    recordingObj.seasonId = dto.seasonId;
    return recordingObj;
  }

  public static fromEntity(entity: RecordingsEntity) {
    return this.from({
      botName: entity.botName,
      score: entity.score,
      seasonId: entity.seasonId,
      recording: entity.recording,
    });
  }
}

import { ApiModelProperty } from "@nestjs/swagger";

export class RecordingPublicDto {
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
  @ApiModelProperty()
  created: Date;

  public static from(dto: Partial<RecordingPublicDto>) {
    const recordingObj = new RecordingPublicDto();
    recordingObj.botName = dto.botName;
    recordingObj.score = dto.score;
    recordingObj.seasonId = dto.seasonId;
    recordingObj.board = dto.board;
    recordingObj.created = dto.created;
    recordingObj.recording = dto.recording;
    return recordingObj;
  }

  public static fromRawDataObject(data: {}) {
    return this.from({
      botName: data["recordings_botName"],
      score: data["recordings_score"],
      board: data["recordings_board"],
      created: data["recordings_createTimeStamp"],
      seasonId: data["recordings_seasonId"],
      recording: JSON.parse(data["recordings_recording"]),
    });
  }
}

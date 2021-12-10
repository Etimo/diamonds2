import { ApiModelProperty } from "@nestjs/swagger";

export class RecordingListDto {
  @ApiModelProperty()
  botName: string;
  @ApiModelProperty()
  score: number;
  @ApiModelProperty()
  board: number;
  @ApiModelProperty()
  recordingId: string;
  @ApiModelProperty()
  created: Date;

  public static from(dto: Partial<RecordingListDto>) {
    const recordingObj = new RecordingListDto();
    recordingObj.botName = dto.botName;
    recordingObj.score = dto.score;
    recordingObj.recordingId = dto.recordingId;
    recordingObj.created = dto.created;
    return recordingObj;
  }

  public static fromRawDataObject(data: {}) {
    return this.from({
      botName: data["recordings_botName"],
      score: data["recordings_score"],
      recordingId: data["recordings_id"],
      created: data["recordings_createTimeStamp"],
    });
  }
}

import { ApiProperty } from "@nestjs/swagger";

export class RecordingListDto {
  @ApiProperty()
  botName!: string;

  @ApiProperty()
  score!: number;

  @ApiProperty()
  board!: number;

  @ApiProperty()
  recordingId!: string;

  @ApiProperty()
  created!: Date;

  // public static from(dto: Partial<RecordingListDto>) {
  //   const recordingObj = new RecordingListDto();
  //   recordingObj.botName = dto.botName;
  //   recordingObj.score = dto.score;
  //   recordingObj.recordingId = dto.recordingId;
  //   recordingObj.created = dto.created;
  //   return recordingObj;
  // }

  // public static fromRawDataObject(data: {}) {
  //   return this.from({
  //     botName: data["recordings_botName"],
  //     score: data["recordings_score"],
  //     recordingId: data["recordings_id"],
  //     created: data["recordings_createTimeStamp"],
  //   });
  // }
}

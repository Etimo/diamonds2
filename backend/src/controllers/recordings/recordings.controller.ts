import { Controller, Get, Body, Post, Param } from "@nestjs/common";
import { ApiUseTags, ApiResponse } from "@nestjs/swagger";
import { RecorderService } from "src/services/recorder.service";
import { RecordingListDto } from "src/models/recording-list.dto";
import { RecordingPublicDto } from "src/models/recording-public.dto";

@ApiUseTags("Recordings")
@Controller("api/recordings")
export class RecordingsController {
  constructor(private recorderService: RecorderService) {}

  /**
   * Returns all highscores on a specific season.
   *
   * @param season The name of the season.
   */
  @ApiResponse({
    status: 200,
    description: "Returns recordings by season",
    isArray: true,
    type: RecordingListDto,
  })
  @ApiResponse({
    status: 404,
    description: "Season not found",
  })
  @Get(":seasonId")
  async list(@Param("seasonId") seasonId: string): Promise<RecordingListDto[]> {
    return await this.recorderService.allBySeasonIdList(seasonId);
  }

  /**
   * Return a specific recording.
   *
   * @param id The id of the recording.
   */
  @ApiResponse({
    status: 200,
    description: "Returns specific recording",
    type: RecordingPublicDto,
  })
  @ApiResponse({
    status: 404,
    description: "Recording not found",
  })
  @Get(":seasonId/:id")
  public find(
    @Param("seasonId") seasonId: string,
    @Param("id") id: string,
  ): Promise<RecordingPublicDto> {
    return this.recorderService.getById(seasonId, id);
  }
}

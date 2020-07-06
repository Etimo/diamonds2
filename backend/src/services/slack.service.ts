import { Injectable } from "@nestjs/common";
import { SeasonsService } from "./seasons.service";
import {
  createSeasonsBody,
  createAddSeasonBody,
  showModal,
  slackError,
} from "../utils/slack.utils";
import { SeasonDto } from "src/models/season.dto";

@Injectable()
export class SlackService {
  constructor(private seasonsService: SeasonsService) {}

  public async getAllSeasons(input) {
    const seasons = await this.seasonsService.all();
    const view = createSeasonsBody(input.trigger_id, seasons);
    return await showModal(view);
  }

  public async getSeasonModal(input) {
    const view = createAddSeasonBody(input.trigger_id);
    return await showModal(view);
  }

  public async handleInteract(input) {
    const payload = JSON.parse(input.payload);

    if (payload.view.callback_id === "add-season") {
      // Using try/catch to catch errors and return them in slack error foramt.
      try {
        const season = await this.addSeason(payload);
        if (season instanceof SeasonDto) {
          return;
        }
      } catch (error) {
        return slackError(error.errorTag, error.message);
      }
    }
    return slackError("season_name", "Could not process input");
  }

  private async addSeason(payload) {
    const startDate = this.parseValues(payload, "start_date", "selected_date");
    const endDate = this.parseValues(payload, "end_date", "selected_date");
    const name = this.parseValues(payload, "season_name", "value");
    const season = SeasonDto.create({
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    return await this.seasonsService.add(season);
  }

  private parseValues(payload, obj, value) {
    const object = payload.view.state.values[obj],
      key = Object.keys(object)[0];
    return object[key][value];
  }
}

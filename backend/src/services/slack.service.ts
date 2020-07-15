import { Injectable } from "@nestjs/common";
import { SeasonsService } from "./seasons.service";
import { TeamsService } from "./teams.service";
import {
  getSeasonListBody,
  getAddSeasonBody,
} from "../utils/slack/season.utils";
import { getTeamListBody, getAddTeamBody } from "../utils/slack/teams.utils";
import { showModal, slackError } from "../utils/slack/utils";
import { SeasonDto } from "../models/season.dto";

@Injectable()
export class SlackService {
  constructor(
    private seasonsService: SeasonsService,
    private teamsService: TeamsService,
  ) {}

  public async getAllSeasons(input) {
    const seasons = await this.seasonsService.all();
    const view = getSeasonListBody(input.trigger_id, seasons);
    return await showModal(view);
  }

  public async getSeasonModal(input) {
    const view = getAddSeasonBody(input.trigger_id);
    return await showModal(view);
  }

  public async getAllTeams(input) {
    const teams = await this.teamsService.all();
    const view = getTeamListBody(input.trigger_id, teams);
    return await showModal(view);
  }

  public async getTeamModal(input) {
    const view = getAddTeamBody(input.trigger_id);
    return await showModal(view);
  }

  public async handleInteract(input) {
    const payload = JSON.parse(input.payload);

    if (payload.view.callback_id === "add-season") {
      // Try/catch to catch errors and return them in slack error format.
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
    const startDate = this.parseValue(payload, "start_date", "selected_date");
    const endDate = this.parseValue(payload, "end_date", "selected_date");
    const name = this.parseValue(payload, "season_name", "value");
    const season = SeasonDto.create({
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    return await this.seasonsService.add(season);
  }

  private parseValue(payload, obj, value) {
    const object = payload.view.state.values[obj],
      key = Object.keys(object)[0];
    return object[key][value];
  }
}

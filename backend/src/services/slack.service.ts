import { Injectable } from "@nestjs/common";
import { SeasonsService } from "./seasons.service";
import { TeamsService } from "./teams.service";
import {
  getSeasonListBody,
  getAddSeasonBody,
} from "../utils/slack/season.utils";
import { getTeamListBody, getAddTeamBody } from "../utils/slack/teams.utils";
import { getWinnerListBody } from "../utils/slack/user.utils";
import { showModal, slackError } from "../utils/slack/utils";
import { SeasonDto } from "../models/season.dto";
import { TeamDto } from "../models/team.dto";
import ForbiddenError from "../errors/forbidden.error";
import { BotDto } from "../models/bot.dto";
import { HighScoresService } from "./high-scores.service";

@Injectable()
export class SlackService {
  constructor(
    private seasonsService: SeasonsService,
    private teamsService: TeamsService,
    private highScoresService: HighScoresService,
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

  private async getWinners(trigger_id, seasonId: SeasonDto["id"]) {
    const users = await this.highScoresService.allBySeasonIdPrivate(
      seasonId,
      10,
    );
    const season = await this.seasonsService.getSeason(seasonId);
    const view = getWinnerListBody(trigger_id, users, season);
    return await showModal(view, "push");
  }

  public async getTeamModal(input) {
    const view = getAddTeamBody(input.trigger_id);
    return await showModal(view);
  }

  public async handleInteract(input) {
    const payload = JSON.parse(input.payload);
    const action = this.actions[payload.view.callback_id];
    if (!action) {
      throw new ForbiddenError("Not a valid callback_id");
    }
    // Try/catch to catch errors and return them in slack error format.
    try {
      const obj = await action.function(payload);
      if (obj instanceof action.dto) {
        return;
      }
    } catch (error) {
      return slackError(error.errorTag, error.message);
    }
    return slackError(action.errorTag, "Could not process input");
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

  private async addTeam(payload) {
    const name = this.parseValue(payload, "team_name", "value");
    const abbreviation = this.parseValue(payload, "team_abbreviation", "value");
    const logotypeUrl = this.parseValue(payload, "team_logotype_url", "value");
    const team = TeamDto.create({
      name,
      abbreviation,
      logotypeUrl,
    });
    console.log("TEAM", team);
    return await this.teamsService.add(team);
  }

  private async showWinners(payload) {
    return await this.getWinners(payload.trigger_id, payload.actions[0].value);
  }

  private parseValue(payload, obj, value) {
    const object = payload.view.state.values[obj],
      key = Object.keys(object)[0];
    return object[key][value];
  }

  private actions = {
    "add-season": {
      function: this.addSeason.bind(this),
      dto: SeasonDto,
      errorTag: "season_name",
    },
    "add-team": {
      function: this.addTeam.bind(this),
      dto: TeamDto,
      errorTag: "team_name",
    },
    "show-winners": {
      function: this.showWinners.bind(this),
      dto: BotDto,
      errorTag: "show-winners",
    },
  };
}

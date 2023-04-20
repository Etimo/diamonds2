import { Injectable } from "@nestjs/common";
import { ForbiddenError } from "../errors";
import { BotDto, SeasonDto, TeamDto } from "../models";
import { INewBoardConfig, INewSeason } from "../types";
import {
  getAddSeasonBody,
  getAddTeamBody,
  getSeasonListBody,
  getTeamListBody,
  getWinnerListBody,
  showModal,
  slackError,
} from "../utils";
import { BoardConfigService } from "./board-config.service";
import { HighscoresService } from "./highscores.service";
import { SeasonsService } from "./seasons.service";
import { TeamsService } from "./teams.service";

@Injectable()
export class SlackService {
  constructor(
    private seasonsService: SeasonsService,
    private teamsService: TeamsService,
    private highscoresService: HighscoresService,
    private boardConfigService: BoardConfigService,
  ) {}

  public async getAllSeasons(input) {
    const seasons = await this.seasonsService.all();
    const view = getSeasonListBody(input.trigger_id, seasons);
    return await showModal(view);
  }

  public async getSeasonModal(input) {
    const view = getAddSeasonBody(input.trigger_id);
    console.log(view);
    return await showModal(view);
  }

  public async getAllTeams(input) {
    const teams = await this.teamsService.all();
    const view = getTeamListBody(input.trigger_id, teams);
    return await showModal(view);
  }

  private async getWinners(trigger_id, seasonId: SeasonDto["id"]) {
    const users = await this.highscoresService.allBySeasonIdPrivate(
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

  private async addSeason(payload): Promise<SeasonDto> {
    const startDate = this.parseValue(payload, "start_date", "selected_date");
    const endDate = this.parseValue(payload, "end_date", "selected_date");
    const name = this.parseValue(payload, "season_name", "value");
    const inventorySize = this.parseValue(payload, "inventory_size", "value");
    const canTackle =
      this.parseValue(payload, "can_tackle", "value") === "true";
    const teleporters = this.parseValue(payload, "teleporters", "value");
    const teleportRelocation = this.parseValue(
      payload,
      "teleport_relocation",
      "value",
    );
    const height = this.parseValue(payload, "height", "value");
    const width = this.parseValue(payload, "width", "value");
    const minimumDelayBetweenMoves = this.parseValue(
      payload,
      "minimum_delay_between_moves",
      "value",
    );
    const sessionLength = this.parseValue(payload, "session_length", "value");
    const boardConfig: INewBoardConfig = {
      inventorySize,
      canTackle,
      teleporters,
      teleportRelocation,
      height,
      width,
      minimumDelayBetweenMoves,
      sessionLength,
    };
    const createdBoardConfig = await this.boardConfigService.add(boardConfig);
    const season: INewSeason = {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      boardConfigId: createdBoardConfig.id,
    };
    const createdSeason = await this.seasonsService.add(season);
    let seasonDto = new SeasonDto();
    seasonDto.id = createdSeason.id;
    seasonDto.name = createdSeason.name;
    seasonDto.startDate = createdSeason.startDate;
    seasonDto.endDate = createdSeason.endDate;
    return seasonDto;
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

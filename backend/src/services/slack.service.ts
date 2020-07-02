import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SeasonsEntity } from "../db/models/seasons.entity";
import { SeasonDto } from "../models/season.dto";
import { SeasonsService } from "./seasons.service";
import axios from "axios";

@Injectable()
export class SlackService {
  constructor(private seasonsService: SeasonsService) {}

  public async getAllSeasons(input) {
    console.log(input);
    const seasons = await this.seasonsService.all();
    const view = this.createBody(input.trigger_id, seasons);
    const headers = {
      "Content-type": "application/json",
      Authorization: input.token,
    };
    axios
      .post("https://slack.com/api/views.open", view, { headers: headers })
      .then(response => {
        const data = response.data;
        if (!data.ok) {
          return data.error;
        }
      })
      .catch(error => {
        console.log("-Error: ", error);
      });
    return "ok";
  }

  private formatSeasonBlocks(seasons) {
    return seasons.flatMap(season => {
      console.log(season);
      return [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${season.name}*`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `${new Date(season.startDate).toISOString()}`,
            },
            {
              type: "mrkdwn",
              text: "-",
            },
            {
              type: "mrkdwn",
              text: `${new Date(season.endDate).toISOString()}`,
            },
          ],
        },
        {
          type: "divider",
        },
      ];
    });
  }

  private createBody(trigger_id, seasons) {
    return {
      trigger_id: trigger_id,
      view: {
        type: "modal",
        title: {
          type: "plain_text",
          text: "Diamonds",
          emoji: true,
        },
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true,
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "plain_text",
              text: "A list of all seasons!",
              emoji: true,
            },
          },
          {
            type: "divider",
          },
          ...this.formatSeasonBlocks(seasons),
        ],
      },
    };
  }
}

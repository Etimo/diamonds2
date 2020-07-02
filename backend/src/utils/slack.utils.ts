const formatSeasonBlocks = seasons => {
  return seasons.flatMap(season => {
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
};

export const createSeasonsBody = (trigger_id, seasons) => {
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
        ...formatSeasonBlocks(seasons),
      ],
    },
  };
};

const formatTeamBlocks = teams => {
  return teams.flatMap(team => {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${team.name}*`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Abbreviation \n *${team.abbreviation}*`,
          },
          {
            type: "mrkdwn",
            text: `Image \n ${team.logotypeUrl}`,
          },
        ],
      },
      {
        type: "divider",
      },
    ];
  });
};

export const getTeamListBody = (trigger_id, teams) => {
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
            text: "A list of all teams!",
            emoji: true,
          },
        },
        {
          type: "divider",
        },
        ...formatTeamBlocks(teams),
      ],
    },
  };
};

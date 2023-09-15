const formatTeamBlocks = (teams: any[]) => {
  return teams.flatMap((team) => {
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

export const getTeamListBody = (trigger_id: any, teams: any[]) => {
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

export const getAddTeamBody = (trigger_id: any) => {
  return {
    trigger_id: trigger_id,
    view: {
      type: "modal",
      callback_id: "add-team",
      submit: {
        type: "plain_text",
        text: "Submit",
        emoji: true,
      },
      close: {
        type: "plain_text",
        text: "Cancel",
        emoji: true,
      },
      title: {
        type: "plain_text",
        text: "Add team",
        emoji: true,
      },
      blocks: [
        {
          type: "input",
          block_id: "team_name",
          element: {
            type: "plain_text_input",
            placeholder: {
              type: "plain_text",
              text: "Company/School",
              emoji: true,
            },
          },
          label: {
            type: "plain_text",
            text: "Team name",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "team_abbreviation",
          element: {
            type: "plain_text_input",
            placeholder: {
              type: "plain_text",
              text: "e.g liu",
              emoji: true,
            },
          },
          label: {
            type: "plain_text",
            text: "Abbreviation ",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "team_logotype_url",
          element: {
            type: "plain_text_input",
            placeholder: {
              type: "plain_text",
              text: "https://some.image.url",
              emoji: true,
            },
          },
          label: {
            type: "plain_text",
            text: "Logotype url",
            emoji: true,
          },
        },
      ],
    },
  };
};

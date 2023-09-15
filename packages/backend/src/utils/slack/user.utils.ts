export const getWinnerListBody = (
  trigger_id: any,
  users: any[],
  season: any,
) => {
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
            text: `Top 10 of ${season.name}!`,
            emoji: true,
          },
        },
        {
          type: "divider",
        },
        ...formatUserBlocks(users),
      ],
    },
  };
};

const formatUserBlocks = (users: any[]) => {
  return users.flatMap((user, index) => {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `* ${index + 1}: ${user.botName}*`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Score:* ${user.score}`,
          },
          {
            type: "mrkdwn",
            text: "-",
          },
          {
            type: "mrkdwn",
            text: `*Email:* ${user.email}`,
          },
        ],
      },
      {
        type: "divider",
      },
    ];
  });
};

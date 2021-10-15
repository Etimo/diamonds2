const formatSeasonBlocks = seasons => {
  return seasons.flatMap(season => {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${season.name}*`,
        },
        accessory: {
          type: "button",
          action_id: "show-winners",
          text: {
            type: "plain_text",
            text: "Visa vinnare",
          },
          style: "primary",
          value: `${season.id}`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: new Date(season.startDate).toISOString().substring(0, 10),
          },
          {
            type: "mrkdwn",
            text: "-",
          },
          {
            type: "mrkdwn",
            text: new Date(season.endDate).toISOString().substring(0, 10),
          },
        ],
      },
      {
        type: "divider",
      },
    ];
  });
};

export const getSeasonListBody = (trigger_id, seasons) => {
  return {
    trigger_id: trigger_id,
    view: {
      type: "modal",
      callback_id: "show-winners",
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

export const getAddSeasonBody = trigger_id => {
  return {
    trigger_id: trigger_id,
    view: {
      type: "modal",
      callback_id: "add-season",
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
        text: "Add season",
        emoji: true,
      },
      blocks: [
        {
          type: "input",
          block_id: "season_name",
          element: {
            type: "plain_text_input",
          },
          label: {
            type: "plain_text",
            text: "Season name",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "start_date",
          element: {
            type: "datepicker",
            initial_date: new Date().toISOString().substring(0, 10),
            placeholder: {
              type: "plain_text",
              text: "Select a date",
              emoji: true,
            },
          },
          label: {
            type: "plain_text",
            text: "Start date",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "end_date",
          element: {
            type: "datepicker",
            initial_date: new Date(Date.now() + 3600 * 30 * 1000 * 24) // Adds 30 days in ms
              .toISOString()
              .substring(0, 10),
            placeholder: {
              type: "plain_text",
              text: "Select a date",
              emoji: true,
            },
          },
          label: {
            type: "plain_text",
            text: "End date",
            emoji: true,
          },
        },
      ],
    },
  };
};

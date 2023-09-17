const formatSeasonBlocks = (seasons: any[]) => {
  return seasons.flatMap((season) => {
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

export const getSeasonListBody = (trigger_id: any, seasons: any) => {
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

export const getAddSeasonBody = (trigger_id: any) => {
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
        {
          type: "input",
          block_id: "inventory_size",
          element: {
            type: "plain_text_input",
            initial_value: "5",
          },
          label: {
            type: "plain_text",
            text: "Inventory size",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "can_tackle",
          element: {
            type: "plain_text_input",
            initial_value: "true",
          },
          label: {
            type: "plain_text",
            text: "Should the bots be able to tackle? (true / false)",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "teleporters",
          element: {
            type: "plain_text_input",
            initial_value: "1",
          },
          label: {
            type: "plain_text",
            text: "Number of teleporters",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "teleport_relocation",
          element: {
            type: "plain_text_input",
            initial_value: "10",
          },
          label: {
            type: "plain_text",
            text: "How often should the teleporters reposition? (seconds)",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "height",
          element: {
            type: "plain_text_input",
            initial_value: "15",
          },
          label: {
            type: "plain_text",
            text: "Height of the board (columns)",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "width",
          element: {
            type: "plain_text_input",
            initial_value: "15",
          },
          label: {
            type: "plain_text",
            text: "Width of the board (columns)",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "minimum_delay_between_moves",
          element: {
            type: "plain_text_input",
            initial_value: "100",
          },
          label: {
            type: "plain_text",
            text: "How often should the bot be able to move? (milliseconds)",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "session_length",
          element: {
            type: "plain_text_input",
            initial_value: "60",
          },
          label: {
            type: "plain_text",
            text: "How long is the game session?",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "separate_boards",
          element: {
            type: "plain_text_input",
            initial_value: "true",
          },
          label: {
            type: "plain_text",
            text: "Should each bot be assigned a separate board? (true / false)",
            emoji: true,
          },
        },
      ],
    },
  };
};

import axios from "axios";

export const showModal = async view => {
  axios
    .post("https://slack.com/api/views.open", view, {
      headers: getSlackHeaders(),
    })
    .then(response => {
      const data = response.data;
      if (!data.ok) {
        return data.error;
      }
    })
    .catch(error => {
      console.log("-Error: ", error);
    });
  return;
};

export const getSlackHeaders = () => {
  return {
    "Content-type": "application/json",
    Authorization: `Bearer ${process.env["SLACK_ACCESS_TOKEN"]}`,
  };
};

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

export const createAddSeasonBody = trigger_id => {
  return {
    trigger_id: trigger_id,
    view: {
      type: "modal",
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
          element: {
            type: "plain_text_input",
          },
          label: {
            type: "plain_text",
            text: "Enter a season name",
            emoji: true,
          },
        },
        {
          type: "input",
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
          element: {
            type: "datepicker",
            initial_date: new Date(Date.now() + 3600 * 30 * 1000 * 24), // Adds 30 days in ms
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

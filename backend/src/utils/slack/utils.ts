import axios from "axios";

export const showModal = async (view, type = "open") => {
  axios
    .post(`https://slack.com/api/views.${type}`, view, {
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

export const slackError = (errorTag, message) => {
  return {
    response_action: "errors",
    errors: {
      [errorTag]: message,
    },
  };
};

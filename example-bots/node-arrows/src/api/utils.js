export const logResponseError = (error) => {
  if (error.response) {
    console.log(error.response.data.data.message);
  }
};

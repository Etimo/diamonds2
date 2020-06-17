export function logResponseError(error) {
  if (error.response) {
    console.log(error.response.data.data.message);
  }
}

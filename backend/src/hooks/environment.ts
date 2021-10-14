export const isLocal = (): boolean => {
  return process.env.ENVIRONMENT === "development";
};

import process from "node:process";
export const isLocal = (): boolean => {
  return process.env.ENVIRONMENT === "development";
};

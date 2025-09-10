export enum NODE_ENV_ENUM {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

export const APP_CONFIG = {
  NODE_ENV: process.env.NODE_ENV ?? NODE_ENV_ENUM.DEVELOPMENT,
};

export enum NODE_ENV_ENUM {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

export const APP_CONFIG = {
  NODE_ENV: process.env.NODE_ENV ?? NODE_ENV_ENUM.DEVELOPMENT,
  URL: process.env.APP_URL || "https://tonysantana.dev",
  ADS_TXT: process.env.ADS_TXT || "",
};

export const PROTOCOL =
  process.env.NODE_ENV === "production" ? "https" : "http";

export const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "localhost:3000";

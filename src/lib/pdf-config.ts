// Environment configuration for PDF generation
export const PDF_CONFIG = {
  // Chromium configuration for different environments
  isServerless: () =>
    !!(process.env.VERCEL_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME),

  // Default timeouts
  timeouts: {
    browser: 30000,
    page: 30000,
    navigation: 30000,
    pdf: 30000,
  },

  // Browser args for different environments
  getBrowserArgs: (isServerless: boolean) => {
    const baseArgs = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ];

    if (isServerless) {
      return [
        ...baseArgs,
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-extensions",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--memory-pressure-off",
        "--disable-ipc-flooding-protection",
      ];
    }

    return baseArgs;
  },
} as const;

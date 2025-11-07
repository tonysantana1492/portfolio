import { NextResponse } from "next/server";

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function GET() {
  try {
    const isServerless = !!(
      process.env.VERCEL_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME
    );

    const diagnostics = {
      isServerless,
      vercelEnv: process.env.VERCEL_ENV,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };

    if (isServerless) {
      const executablePath = await chromium.executablePath();

      // Test browser launch
      const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: executablePath,
        headless: true,
      });

      const page = await browser.newPage();
      await page.goto("data:text/html,<h1>Test Page</h1>");
      const title = await page.title();
      await browser.close();

      return NextResponse.json({
        status: "success",
        chromiumPath: executablePath,
        pageTitle: title,
        diagnostics,
      });
    } else {
      return NextResponse.json({
        status: "local_environment",
        message: "Running in local development mode",
        diagnostics,
      });
    }
  } catch (error) {
    console.error("Chromium test error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

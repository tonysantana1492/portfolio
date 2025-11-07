import { NextResponse } from "next/server";

import chromium from "@sparticuz/chromium";

import { PDF_CONFIG } from "@/lib/pdf-config";

export async function GET() {
  try {
    const isServerless = PDF_CONFIG.isServerless();

    console.log("Environment check:");
    console.log("- VERCEL_ENV:", process.env.VERCEL_ENV);
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    console.log("- Is Serverless:", isServerless);

    if (isServerless) {
      chromium.setGraphicsMode = false;

      try {
        const executablePath = await chromium.executablePath();
        console.log("- Chromium executable found at:", executablePath);

        return NextResponse.json({
          status: "ok",
          environment: "serverless",
          chromiumPath: executablePath,
        });
      } catch (error) {
        console.error("Chromium executable error:", error);

        return NextResponse.json({
          status: "error",
          environment: "serverless",
          error: error instanceof Error ? error.message : "Unknown error",
          chromiumPath: null,
        });
      }
    } else {
      try {
        // Try to import regular puppeteer for local development
        await import("puppeteer");

        return NextResponse.json({
          status: "ok",
          environment: "local",
          chromiumPath: "system",
          version: "bundled",
        });
      } catch (error) {
        return NextResponse.json({
          status: "error",
          environment: "local",
          error: error instanceof Error ? error.message : "Unknown error",
          chromiumPath: null,
        });
      }
    }
  } catch (error) {
    console.error("Health check error:", error);

    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

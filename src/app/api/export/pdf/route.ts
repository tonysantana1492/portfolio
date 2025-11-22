import { type NextRequest, NextResponse } from "next/server";

import chromium from "@sparticuz/chromium";
import puppeteer, { type Browser } from "puppeteer-core";

// Helper function to launch browser with retries
async function launchBrowserWithRetry(executablePath: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor",
          "--memory-pressure-off",
          "--max_old_space_size=4096",
        ],
        executablePath: executablePath,
        headless: true,
        defaultViewport: null,
        timeout: 30000,
      });
      return browser;
    } catch (error) {
      console.log(`Browser launch attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) {
        throw error;
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error("Failed to launch browser after all retries");
}

export async function POST(req: NextRequest) {
  let browser: Browser | undefined;

  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host");
    const baseUrl = `${protocol}://${host}`;

    const url = `${baseUrl}/print/${encodeURIComponent(slug)}`;

    // Environment check
    const isServerless = !!(
      process.env.VERCEL_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME
    );

    console.log("Environment check:");
    console.log("- VERCEL_ENV:", process.env.VERCEL_ENV);
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    console.log("- Is Serverless:", isServerless);

    if (isServerless) {
      const executablePath = await chromium.executablePath();
      console.log("- Chromium executable found at:", executablePath);

      // For Vercel deployment - use @sparticuz/chromium with retry logic
      browser = await launchBrowserWithRetry(executablePath);
    } else {
      // For local development - use local puppeteer
      const puppeteerLocal = await import("puppeteer");
      browser = await puppeteerLocal.default.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 800 });

    // Add additional timeout and error handling
    await page.setDefaultTimeout(25000);
    await page.setDefaultNavigationTimeout(25000);

    // Navigate to the print page
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 25000,
    });

    // Wait a bit more to ensure all resources are loaded
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const pdfBuffer = await page.pdf({
      path: undefined,
      printBackground: true,
      preferCSSPageSize: true,
      format: "A4",
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      timeout: 25000,
    });

    await browser.close();

    const fileName = `${slug || "document"}.pdf`;

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);

    // Log additional error details for debugging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Close browser if it was opened
    try {
      if (browser) {
        await browser.close();
      }
    } catch (closeError) {
      console.error("Error closing browser:", closeError);
    }

    return NextResponse.json(
      {
        error: "Failed to export PDF",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        environment: {
          vercelEnv: process.env.VERCEL_ENV,
          nodeEnv: process.env.NODE_ENV,
        },
      },
      { status: 500 }
    );
  }
}

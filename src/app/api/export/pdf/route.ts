import { type NextRequest, NextResponse } from "next/server";

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

type PageLike = {
  setViewport: (opts: { width: number; height: number }) => Promise<void>;
  setDefaultTimeout: (ms: number) => void | Promise<void>;
  setDefaultNavigationTimeout: (ms: number) => void | Promise<void>;
  goto: (url: string, opts?: unknown) => Promise<unknown>;
  pdf: (opts?: unknown) => Promise<Buffer>;
};

type BrowserLike = {
  newPage: () => Promise<unknown>;
  close: () => Promise<void>;
};

export async function POST(req: NextRequest) {
  let browser: unknown;

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

    const launchWithRetry = async (
      launchFn: () => Promise<unknown>,
      attempts = 3
    ): Promise<unknown> => {
      let lastErr: unknown;
      for (let i = 0; i < attempts; i++) {
        try {
          return await launchFn();
        } catch (err) {
          lastErr = err;
          // ETXTBSY may resolve after a short wait; exponential backoff
          const backoff = 200 * 2 ** i;
          console.warn(
            `launch attempt ${i + 1} failed, retrying in ${backoff}ms`,
            String(err)
          );
          await new Promise((r) => setTimeout(r, backoff));
        }
      }
      throw lastErr;
    };

    if (isServerless) {
      const executablePath = await chromium.executablePath();
      console.log("- Chromium executable found at:", executablePath);

      // For Vercel deployment - use @sparticuz/chromium
      browser = await launchWithRetry(async () => {
        return await puppeteer.launch({
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
      });
    } else {
      // For local development - use local puppeteer (fallback)
      const puppeteerLocal = await import("puppeteer");
      browser = await launchWithRetry(async () => {
        return await puppeteerLocal.default.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
      });
    }

    // Create a page after browser launched
    const page = (await (
      browser as unknown as BrowserLike
    ).newPage()) as unknown as PageLike;

    await page.setViewport({ width: 1200, height: 800 });
    await page.setDefaultTimeout(25000);
    await page.setDefaultNavigationTimeout(25000);

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

    await (browser as unknown as BrowserLike).close();

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
        await (browser as unknown as BrowserLike).close();
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

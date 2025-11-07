import { type NextRequest, NextResponse } from "next/server";

import chromium from "@sparticuz/chromium";
import puppeteer, { type Browser, type Page } from "puppeteer-core";

import { PDF_CONFIG } from "@/lib/pdf-config";

export async function POST(req: NextRequest) {
  let browser: Browser | undefined;
  let page: Page | undefined;

  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host");
    const baseUrl = `${protocol}://${host}`;

    const url = `${baseUrl}/print/${encodeURIComponent(slug)}`;

    const isVercel = !!process.env.VERCEL_ENV;
    const isServerless = PDF_CONFIG.isServerless();
    console.log(
      `Environment: ${
        isVercel ? "Vercel" : "Local"
      } (Serverless: ${isServerless})`
    );
    console.log(`Target URL: ${url}`);

    // Configure Chromium for serverless environment
    if (isServerless) {
      // Disable graphics mode for serverless environment
      chromium.setGraphicsMode = false;
    }

    const pptr = isServerless
      ? puppeteer
      : ((await import("puppeteer")) as unknown as typeof puppeteer);

    // Get the executable path with error handling
    let executablePath: string | undefined;
    if (isServerless) {
      try {
        executablePath = await chromium.executablePath();
        console.log(`Chromium executable path: ${executablePath}`);
      } catch (error) {
        console.error("Error getting Chromium executable path:", error);
        throw new Error(
          `Chromium executable not found: ${
            error instanceof Error ? error.message : "Unknown error"
          }. Please ensure @sparticuz/chromium is properly installed and configured.`
        );
      }
    }

    // Launch browser with enhanced configuration
    const browserArgs = PDF_CONFIG.getBrowserArgs(isServerless);
    console.log(`Browser args: ${browserArgs.join(" ")}`);

    browser = await pptr.launch(
      isServerless
        ? {
            args: [...chromium.args, ...browserArgs],
            executablePath,
            headless: true,
            timeout: PDF_CONFIG.timeouts.browser,
          }
        : {
            headless: true,
            args: browserArgs,
            timeout: PDF_CONFIG.timeouts.browser,
          }
    );

    page = await browser.newPage();

    // Set longer timeouts and viewport
    await page.setDefaultTimeout(PDF_CONFIG.timeouts.page);
    await page.setDefaultNavigationTimeout(PDF_CONFIG.timeouts.navigation);
    await page.setViewport({ width: 1200, height: 1600 });

    // Navigate with retry logic
    let retries = 3;
    let lastError: unknown;

    while (retries > 0) {
      try {
        console.log(`Navigating to: ${url}`);
        await page.goto(url, {
          waitUntil: "networkidle2",
          timeout: PDF_CONFIG.timeouts.navigation,
        });

        // Wait for content to be rendered
        await page.waitForSelector(".print-container", { timeout: 10000 });

        // Wait for the page to signal it's ready for PDF generation
        try {
          await page.waitForFunction(
            () => document.body.getAttribute("data-print-ready") === "true",
            { timeout: 10000 }
          );
        } catch {
          console.warn("Ready signal timeout, checking for content directly");
          // Fallback: check if content is actually present
          const hasContent = await page.evaluate(() => {
            const container = document.querySelector(".print-container");
            return (
              container?.textContent && container.textContent.trim().length > 0
            );
          });

          if (!hasContent) {
            throw new Error("Page content not found");
          }
        }

        // Additional wait to ensure all styles are applied
        await page.evaluate(() => {
          return new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        });

        break;
      } catch (error) {
        lastError = error;
        retries--;
        if (retries > 0) {
          console.warn(
            `PDF generation attempt failed, retrying... (${retries} attempts left)`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    if (retries === 0) {
      throw (
        lastError || new Error("Failed to load page after multiple attempts")
      );
    }

    // Generate PDF with enhanced settings
    const pdfBuffer = await page.pdf({
      path: undefined,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      timeout: PDF_CONFIG.timeouts.pdf,
    });

    const fileName = `${slug || "document"}.pdf`;

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);

    // Log additional debugging information
    console.log("Environment variables:");
    console.log("- VERCEL_ENV:", process.env.VERCEL_ENV);
    console.log("- NODE_ENV:", process.env.NODE_ENV);

    let errorMessage = "An unexpected error occurred during PDF generation";

    if (error instanceof Error) {
      if (error.message.includes("executablePath")) {
        errorMessage = `Chromium browser not found. This usually happens in serverless environments. Error: ${error.message}`;
      } else if (error.message.includes("Navigation timeout")) {
        errorMessage = `Page navigation timed out. The target page may be taking too long to load. Error: ${error.message}`;
      } else if (error.message.includes("Page content not found")) {
        errorMessage = `The page content could not be found or loaded properly. Error: ${error.message}`;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: `PDF generation failed: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  } finally {
    // Ensure cleanup happens even if there's an error
    try {
      if (page) {
        await page.close();
      }
      if (browser) {
        await browser.close();
      }
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError);
    }
  }
}

import { type NextRequest, NextResponse } from "next/server";

import chromium from "@sparticuz/chromium";
import puppeteer, { type Browser, type Page } from "puppeteer-core";

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

    const pptr = isVercel
      ? puppeteer
      : ((await import("puppeteer")) as unknown as typeof puppeteer);

    // Launch browser with enhanced configuration
    browser = await pptr.launch(
      isVercel
        ? {
            args: [
              ...chromium.args,
              "--no-sandbox",
              "--disable-setuid-sandbox",
              "--disable-dev-shm-usage",
              "--disable-gpu",
              "--no-first-run",
              "--no-zygote",
              "--single-process",
              "--disable-extensions",
            ],
            executablePath: await chromium.executablePath(),
            headless: true,
            timeout: 30000,
          }
        : {
            headless: true,
            args: [
              ...puppeteer.defaultArgs(),
              "--no-sandbox",
              "--disable-setuid-sandbox",
              "--disable-dev-shm-usage",
            ],
            timeout: 30000,
          }
    );

    page = await browser.newPage();

    // Set longer timeouts and viewport
    await page.setDefaultTimeout(30000);
    await page.setDefaultNavigationTimeout(30000);
    await page.setViewport({ width: 1200, height: 1600 });

    // Navigate with retry logic
    let retries = 3;
    let lastError: unknown;

    while (retries > 0) {
      try {
        console.log(`Navigating to: ${url}`);
        await page.goto(url, {
          waitUntil: "networkidle2",
          timeout: 30000,
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
      timeout: 30000,
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

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during PDF generation";

    return NextResponse.json(
      { error: `PDF generation failed: ${errorMessage}` },
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

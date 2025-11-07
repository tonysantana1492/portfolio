import { type NextRequest, NextResponse } from "next/server";

import chromium from "@sparticuz/chromium";
import puppeteer, { type Browser } from "puppeteer-core";

// Configure timeout for Vercel
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host");
    const baseUrl = `${protocol}://${host}`;

    const url = `${baseUrl}/print/${encodeURIComponent(slug)}`;

    const isVercel = !!process.env.VERCEL_ENV;

    let browser: Browser;

    if (isVercel) {
      // For Vercel deployment
      browser = await puppeteer.launch({
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
        ],
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      // For local development
      const puppeteerLocal = await import("puppeteer");
      browser = await puppeteerLocal.default.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 800 });

    // Navigate to the print page
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 20000,
    });

    // Wait a bit more to ensure all resources are loaded
    await new Promise((resolve) => setTimeout(resolve, 1000));

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

    return NextResponse.json(
      {
        error: "Failed to export PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

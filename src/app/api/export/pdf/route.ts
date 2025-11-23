import { type NextRequest, NextResponse } from "next/server";

import chromium from "@sparticuz/chromium";
import puppeteer, { type Browser } from "puppeteer-core";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  let browser: Browser | undefined;

  try {
    const isVercel = !!process.env.VERCEL_ENV;

    const pptr = isVercel
      ? puppeteer
      : ((await import("puppeteer")) as unknown as typeof puppeteer);

    browser = await pptr.launch(
      isVercel
        ? {
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
          }
        : {
            headless: true,
            args: puppeteer.defaultArgs(),
          }
    );

    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host");
    const baseUrl = `${protocol}://${host}`;

    const url = `${baseUrl}/print/${encodeURIComponent(slug)}`;

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    const pdf = await page.pdf({
      path: undefined,
      printBackground: true,
    });
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="page-output.pdf"',
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("An error occurred while generating the PDF.", {
      status: 500,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

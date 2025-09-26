import { type NextRequest, NextResponse } from "next/server";

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function GET(request: NextRequest) {
  // const { searchParams } = new URL(request.url);
  // const htmlParam = searchParams.get("html");
  // if (!htmlParam) {
  //   return new NextResponse("Please provide the HTML.", { status: 400 });
  // }

  let browser: any;

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

    const url = `https://tonysantana.dev/print/${encodeURIComponent(
      "68d21822750a73c7d1738920"
    )}`;

    const page = await browser.newPage();
    // await page.setContent(htmlParam, { waitUntil: 'load' });

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

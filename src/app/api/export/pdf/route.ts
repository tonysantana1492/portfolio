import type { NextRequest } from "next/server";

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// const isServerless = !!process.env.VERCEL || !!process.env.AWS_REGION;

// async function getExecutablePath() {
//   if (isServerless) return await chromium.executablePath();
//   if (process.env.PUPPETEER_EXECUTABLE_PATH)
//     return process.env.PUPPETEER_EXECUTABLE_PATH;
//   throw new Error(
//     "Define PUPPETEER_EXECUTABLE_PATH en .env.local con la ruta a Chrome/Edge."
//   );
// }

export async function POST(req: NextRequest) {
  const { slug } = await req.json();

  // if (!slug || typeof slug !== "string") {
  //   console.log("Invalid slug provided");
  //   return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  // }

  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host");
  const baseUrl = `${protocol}://${host}`;

  const url = `${baseUrl}/print/${encodeURIComponent(slug)}`;

  const viewport = {
    deviceScaleFactor: 1,
    hasTouch: false,
    height: 1080,
    isLandscape: true,
    isMobile: false,
    width: 1920,
  };

  // const browser = await puppeteer.launch({
  //   defaultViewport: viewport,
  //   headless: true,
  //   executablePath: await getExecutablePath(),
  //   args: isServerless ? chromium.args : [],
  // });

  const isVercel = !!process.env.VERCEL_ENV;

  const pptr = isVercel
    ? puppeteer
    : ((await import("puppeteer")) as unknown as typeof puppeteer);

  const browser = await pptr.launch(
    isVercel
      ? {
          defaultViewport: viewport,
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: true,
        }
      : {
          defaultViewport: viewport,
          headless: true,
          args: puppeteer.defaultArgs(),
        }
  );

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  await page.emulateMediaType("print");
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: "light" },
  ]);

  const pdfBuffer = await page.pdf({
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();

  const fileName = `${slug || "document"}.pdf`;

  return new Response(Buffer.from(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": pdfBuffer.length.toString(),
    },
  });
}

import { type NextRequest, NextResponse } from "next/server";

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function POST(req: NextRequest) {
  const { slug } = await req.json();

  if (!slug || typeof slug !== "string") {
    console.log("Invalid slug provided");
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host");
  const baseUrl = `${protocol}://${host}`;

  const url = `${baseUrl}/print/${encodeURIComponent(slug)}`;

  const isVercel = !!process.env.VERCEL_ENV;

  const pptr = isVercel
    ? puppeteer
    : ((await import("puppeteer")) as unknown as typeof puppeteer);

  const browser = await pptr.launch(
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

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  await page.emulateMediaType("print");
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: "light" },
  ]);

  const pdfBuffer = await page.pdf({
    format: "A4",
    path: undefined,
    printBackground: true,
    preferCSSPageSize: true,
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
}

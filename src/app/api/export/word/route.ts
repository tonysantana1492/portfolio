import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import htmlToDocx from "html-to-docx";
import { JSDOM } from "jsdom";

export async function POST(req: NextRequest) {
  try {
    const { html, filename = "export.docx" } = await req.json();

    if (!html || typeof html !== "string") {
      return NextResponse.json({ error: "Missing html" }, { status: 400 });
    }

    const { window } = new JSDOM(html);
    const buffer = await htmlToDocx(window.document.documentElement.outerHTML, undefined, {
      table: { row: { cantSplit: true } },
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename=${JSON.stringify(filename).slice(1, -1)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to export DOCX" }, { status: 500 });
  }
}

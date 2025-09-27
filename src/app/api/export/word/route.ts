import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import htmlToDocx from "html-to-docx";
import { JSDOM } from "jsdom";

import { mdxToHtml } from "@/lib/mdx-to-html";
import { getCvBySlug } from "@/services/cv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support both direct HTML and slug-based conversion
    let html: string;
    let filename = "export.docx";

    if (body.html) {
      // Direct HTML mode (existing functionality)
      html = body.html;
      filename = body.filename || filename;
    } else if (body.slug) {
      // Slug-based mode (new functionality)
      const cv = getCvBySlug(body.slug);

      if (!cv) {
        return NextResponse.json(
          { error: `CV with slug "${body.slug}" not found` },
          { status: 404 }
        );
      }

      // Convert MDX content to HTML
      console.log("Converting MDX to HTML for CV:", cv.slug);
      console.log("Original content preview:", cv.content.substring(0, 200));

      html = await mdxToHtml(cv.content);

      console.log("Converted HTML type:", typeof html);
      console.log("Converted HTML length:", html?.length || 0);
      console.log(
        "Converted HTML preview:",
        html?.substring(0, 200) || "NO HTML RESULT"
      );

      if (!html || html === "undefined" || html.trim() === "") {
        console.error("MDX conversion returned invalid result:", html);
        return NextResponse.json(
          { error: "Failed to convert CV content to HTML" },
          { status: 500 }
        );
      }

      filename = `${cv.slug}.docx`;

      // Add document styling and structure
      console.log("Creating HTML document template...");
      console.log(
        "HTML content to insert:",
        html?.substring(0, 100) || "EMPTY"
      );

      const htmlContent = html || "<div>No content available</div>";

      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${cv.metadata.title}</title>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;

      console.log("Final HTML document length:", html.length);
      console.log("Final HTML document preview:", html.substring(0, 300));
    } else {
      return NextResponse.json(
        { error: "Missing required parameter: either 'html' or 'slug'" },
        { status: 400 }
      );
    }

    if (!html || typeof html !== "string") {
      return NextResponse.json(
        { error: "Invalid HTML content" },
        { status: 400 }
      );
    }

    const { window } = new JSDOM(html);
    const buffer = await htmlToDocx(
      window.document.documentElement.outerHTML,
      undefined,
      {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      }
    );

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename=${JSON.stringify(
          filename
        ).slice(1, -1)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Export to Word failed:", err);
    return NextResponse.json(
      {
        error: "Failed to export DOCX",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

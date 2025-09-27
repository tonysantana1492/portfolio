import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkRehype from "remark-rehype";

/**
 * Converts MDX content to HTML string with robust JSX handling
 * @param mdxContent - The MDX content as string
 * @returns Promise<string> - The HTML string
 */
export async function mdxToHtml(mdxContent: string): Promise<string> {
  try {
    console.log("=== MDX TO HTML CONVERSION START ===");
    console.log("Input content type:", typeof mdxContent);
    console.log("Input content length:", mdxContent?.length || 0);
    console.log(
      "Input content preview:",
      mdxContent?.substring(0, 200) || "NO CONTENT"
    );

    if (!mdxContent || mdxContent.trim() === "") {
      console.log("Empty input content, returning empty div");
      return "<div>No content available</div>";
    }

    // Enhanced pre-processing for JSX and MDX content
    const processedContent = mdxContent
      // Convert JSX className to class attribute
      .replace(/className="([^"]*)"/g, 'class="$1"')
      .replace(/className=\{([^}]*)\}/g, 'class="$1"')

      // Handle JSX components
      .replace(/<h1 class="([^"]*)">/g, '<h1 class="$1">')
      .replace(/<div class="([^"]*)">/g, '<div class="$1">')

      // Convert center tags to div with inline styles and preserve content
      .replace(/<center>\s*([\s\S]*?)\s*<\/center>/g, (_, content) => {
        // Process markdown within center tags
        const processedContent = content
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        return `<div style="text-align: center;">${processedContent}</div>`;
      })

      // Handle JSX string expressions
      .replace(/\{"\s*"\}/g, " ")
      .replace(/\{'\s*'\}/g, " ")
      .replace(/\{\s*"\s*"\s*\}/g, " ")
      .replace(/\{\s*'\s*'\s*\}/g, " ")

      // Clean up any remaining empty JSX expressions
      .replace(/\{\s*\}/g, "")

      // Fix self-closing tags (make them properly closed)
      .replace(/\s*\/>/g, ">")

      // Handle line breaks and spacing
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .trim();

    console.log(
      "Pre-processed content preview:",
      processedContent.substring(0, 300)
    );

    // Try using the remark processor first
    try {
      const processor = remark()
        .use(remarkGfm)
        .use(remarkMdx)
        .use(remarkRehype, {
          allowDangerousHtml: true,
          passThrough: ["mdxjsEsm", "mdxJsxFlowElement", "mdxJsxTextElement"],
        })
        .use(rehypeRaw)
        .use(rehypeStringify, { allowDangerousHtml: true });

      const result = await processor.process(processedContent);
      console.log("Raw result:", result);
      console.log("Raw result type:", typeof result);

      let htmlOutput = String(result);
      console.log("String conversion result:", htmlOutput);
      console.log("String conversion type:", typeof htmlOutput);
      console.log("String conversion length:", htmlOutput.length);

      if (!htmlOutput || htmlOutput.trim() === "") {
        console.log("Remark returned empty result, using enhanced fallback");
        return enhancedMarkdownToHtml(processedContent);
      }

      // Post-process the HTML
      htmlOutput = htmlOutput
        .replace(/\s+class=""/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();

      console.log(
        "Remark conversion successful, HTML preview:",
        htmlOutput.substring(0, 300)
      );
      return htmlOutput;
    } catch (remarkError) {
      console.error(
        "Remark processing failed, using enhanced fallback:",
        remarkError
      );
      return enhancedMarkdownToHtml(processedContent);
    }
  } catch (error) {
    console.error("Error converting MDX to HTML:", error);
    console.log("Using simple fallback conversion...");
    return simpleMarkdownToHtml(mdxContent);
  }
}

/**
 * Enhanced markdown to HTML converter with better JSX support
 * This handles the specific format used in your CV
 */
function enhancedMarkdownToHtml(content: string): string {
  console.log("=== ENHANCED MARKDOWN TO HTML START ===");
  console.log("Enhanced input content length:", content?.length || 0);
  console.log(
    "Enhanced input preview:",
    content?.substring(0, 200) || "NO CONTENT"
  );

  if (!content || content.trim() === "") {
    console.log("Empty content in enhanced converter");
    return "<div>No content available</div>";
  }

  const lines = content.split("\n");
  const htmlLines: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      if (inList) {
        htmlLines.push("</ul>");
        inList = false;
      }
      htmlLines.push("");
      continue;
    }

    // Handle existing HTML tags (keep them as-is)
    if (
      trimmedLine.startsWith("<") &&
      (trimmedLine.includes(">") || trimmedLine.includes("class="))
    ) {
      if (inList && !trimmedLine.startsWith("<li")) {
        htmlLines.push("</ul>");
        inList = false;
      }
      htmlLines.push(trimmedLine);
      continue;
    }

    // Handle headers (check longer patterns first to avoid conflicts)
    if (trimmedLine.startsWith("#### ")) {
      if (inList) {
        htmlLines.push("</ul>");
        inList = false;
      }
      htmlLines.push(`<h4>${trimmedLine.substring(5)}</h4>`);
      continue;
    }
    if (trimmedLine.startsWith("### ")) {
      if (inList) {
        htmlLines.push("</ul>");
        inList = false;
      }
      htmlLines.push(`<h3>${trimmedLine.substring(4)}</h3>`);
      continue;
    }
    if (trimmedLine.startsWith("## ")) {
      if (inList) {
        htmlLines.push("</ul>");
        inList = false;
      }
      htmlLines.push(`<h2>${trimmedLine.substring(3)}</h2>`);
      continue;
    }
    if (trimmedLine.startsWith("# ") && !trimmedLine.includes("<h1")) {
      if (inList) {
        htmlLines.push("</ul>");
        inList = false;
      }
      htmlLines.push(`<h1>${trimmedLine.substring(2)}</h1>`);
      continue;
    }

    // Handle list items (including bullet points)
    if (
      trimmedLine.startsWith("- ") ||
      trimmedLine.startsWith("* ") ||
      trimmedLine.startsWith("• ") ||
      trimmedLine.match(/^[•·‣‧⁃]\s+/)
    ) {
      if (!inList) {
        htmlLines.push("<ul>");
        inList = true;
      }
      // Extract list content after the bullet/marker
      let listContent = "";
      if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        listContent = trimmedLine.substring(2);
      } else if (trimmedLine.startsWith("• ")) {
        listContent = trimmedLine.substring(2);
      } else {
        // Handle other bullet characters
        listContent = trimmedLine.substring(1).trim();
      }
      htmlLines.push(`<li>${processInlineMarkdown(listContent)}</li>`);
      continue;
    }

    // Regular paragraph
    if (inList) {
      htmlLines.push("</ul>");
      inList = false;
    }

    // Process inline markdown
    const processedLine = processInlineMarkdown(trimmedLine);
    if (processedLine) {
      htmlLines.push(`<p>${processedLine}</p>`);
    }
  }

  // Close any remaining list
  if (inList) {
    htmlLines.push("</ul>");
  }

  const result = htmlLines.join("\n").replace(/\n{3,}/g, "\n\n");
  console.log("Enhanced conversion result length:", result.length);
  console.log("Enhanced conversion result preview:", result.substring(0, 300));
  console.log("=== ENHANCED MARKDOWN TO HTML SUCCESS ===");

  return result;
}

/**
 * Process inline markdown elements (bold, italic, links, etc.)
 */
function processInlineMarkdown(text: string): string {
  return (
    text
      // Bold text first (longer patterns first to avoid conflicts)
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")
      // Italic text - simple approach
      .replace(/_((?:(?!_)[^\n])*)_/g, "<em>$1</em>") // Handles text with spaces and special chars
      .replace(/\*((?!\*)[^*\n]*?)\*/g, "<em>$1</em>")
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Inline code
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // Clean up extra spaces
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Enhanced markdown to HTML converter that handles JSX-like syntax
 * This is a fallback method for more complex conversion
 */
export function simpleMarkdownToHtml(markdownContent: string): string {
  console.log("=== SIMPLE MARKDOWN TO HTML START ===");
  console.log("Simple input content length:", markdownContent?.length || 0);
  console.log(
    "Simple input preview:",
    markdownContent?.substring(0, 200) || "NO CONTENT"
  );

  if (!markdownContent || markdownContent.trim() === "") {
    console.log("Empty content in simple converter");
    return "<div>No content available</div>";
  }
  // Enhanced markdown to HTML conversion with JSX support
  const html = markdownContent
    // Handle JSX components first
    .replace(/className=/g, "class=")
    // Convert center tags to div with inline styles and process markdown within
    .replace(/<center>\s*([\s\S]*?)\s*<\/center>/g, (_, content) => {
      // Process markdown within center tags
      const processedContent = content
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      return `<div style="text-align: center;">${processedContent}</div>`;
    })
    .replace(/\{"\s*"\}/g, " ")
    .replace(/\{' '\}/g, " ")
    .replace(/\{\s*\}/g, "")

    // Headers (check longer patterns first, keep existing JSX h1 tags)
    .replace(/^#### (.*$)/gm, "<h4>$1</h4>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^# ((?!<h1).*$)/gm, "<h1>$1</h1>") // Don't replace if already JSX h1

    // Bold and italic (process bold first to avoid conflicts)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    .replace(/_((?:(?!_)[^\n])*)_/g, "<em>$1</em>")
    .replace(/\*((?!\*)[^*\n]*?)\*/g, "<em>$1</em>")

    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")

    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")

    // Lists (handle various bullet characters)
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/^\* (.*$)/gm, "<li>$1</li>")
    .replace(/^• (.*$)/gm, "<li>$1</li>")
    .replace(/^[•·‣‧⁃]\s+(.*$)/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");

  // Split into paragraphs and process
  const paragraphs = html.split(/\n\s*\n/).filter((p) => p.trim());

  const processedParagraphs = paragraphs
    .map((paragraph) => {
      const trimmedParagraph = paragraph.trim();

      // Skip if already an HTML block element
      if (
        trimmedParagraph.startsWith("<h") ||
        trimmedParagraph.startsWith("<div") ||
        trimmedParagraph.startsWith("<ul") ||
        trimmedParagraph.startsWith("<pre") ||
        trimmedParagraph.startsWith("<center")
      ) {
        return trimmedParagraph;
      }

      // Wrap in paragraph if not empty
      if (trimmedParagraph.length > 0) {
        return `<p>${trimmedParagraph}</p>`;
      }

      return "";
    })
    .filter((p) => p.length > 0);

  const finalResult = `<div>${processedParagraphs.join("\n")}</div>`;
  console.log("Simple conversion final result length:", finalResult.length);
  console.log(
    "Simple conversion final result preview:",
    finalResult.substring(0, 300)
  );
  console.log("=== SIMPLE MARKDOWN TO HTML SUCCESS ===");

  return finalResult;
}

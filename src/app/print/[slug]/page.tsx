import "./print.css";

import { MDX } from "@/components/shared/mdx";
import { PROFILE } from "@/content/profile";
import { cvToMdx } from "@/lib/cv-to-mdx";

export default async function PrintPage() {
  const mdx = cvToMdx(PROFILE);

  return (
    <>
      <div className="print-container" data-testid="print-container">
        <MDX code={mdx} />
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Signal that the page is ready for PDF generation
            document.addEventListener('DOMContentLoaded', function() {
              document.body.setAttribute('data-print-ready', 'true');
            });
          `,
        }}
      />
    </>
  );
}

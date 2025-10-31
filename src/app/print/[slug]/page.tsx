import "./print.css";

import Script from "next/script";

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
      <Script>
        {`
            // Signal that the page is ready for PDF generation
            document.addEventListener('DOMContentLoaded', function() {
              document.body.setAttribute('data-print-ready', 'true');
            });
        `}
      </Script>
    </>
  );
}

import { Suspense } from "react";

import { MarkdownAsync } from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { components } from "@/components/shared/mdx";
import { UTM_PARAMS } from "@/config/site.config";
import { rehypeAddQueryParams } from "@/lib/rehype-add-query-params";

export function Markdown(props: React.ComponentProps<typeof MarkdownAsync>) {
  return (
    <Suspense>
      <MarkdownAsync
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [
            rehypeExternalLinks,
            { target: "_blank", rel: "nofollow noopener noreferrer" },
          ],
          [rehypeAddQueryParams, UTM_PARAMS],
        ]}
        {...props}
      />
    </Suspense>
  );
}

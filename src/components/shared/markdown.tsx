import { MarkdownAsync } from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { components } from "@/components/shared/mdx";
import { getUTMParams } from "@/config/site.config";
import { rehypeAddQueryParams } from "@/lib/rehype-add-query-params";

export function Markdown(props: React.ComponentProps<typeof MarkdownAsync>) {
  const utmParams = getUTMParams();
  return (
    <MarkdownAsync
      components={components}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        [
          rehypeExternalLinks,
          { target: "_blank", rel: "nofollow noopener noreferrer" },
        ],
        [rehypeAddQueryParams, utmParams],
      ]}
      {...props}
    />
  );
}

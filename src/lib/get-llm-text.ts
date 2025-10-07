import dayjs from "dayjs";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";

import type { Post } from "@/lib/blog";
import { remarkComponent } from "@/lib/remark-component";

const processor = remark().use(remarkMdx).use(remarkComponent).use(remarkGfm);

export async function getLLMText(post: Post) {
  const processed = await processor.process({
    value: post.content,
  });

  return `# ${post.metadata.title}

${post.metadata.description}

${processed.value}

Last updated on ${dayjs(post.metadata.updatedAt).format("MMMM D, YYYY")}`;
}

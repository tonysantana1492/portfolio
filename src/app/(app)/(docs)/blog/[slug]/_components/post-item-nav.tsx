import Link from "next/link";

import { getTableOfContents } from "fumadocs-core/content/toc";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import type { BlogSectionProps } from "@/app/(app)/(docs)/blog/[slug]/_components/post-post-section";
import { LLMCopyButtonWithViewOptions } from "@/components/ai/page-actions";
import { InlineTOC } from "@/components/shared/inline-toc";
import { LinkButton } from "@/components/shared/link-button";
import { PostKeyboardShortcuts } from "@/components/shared/post-keyboard-shortcuts";
import { ShareMenu } from "@/components/shared/share-menu";
import { Button } from "@/components/ui/button";

export function PostItemNav({ previous, next, post }: BlogSectionProps) {
  const toc = getTableOfContents(post.content);
  const urlPost = `blog/${post.slug}`;

  return (
    <>
      <PostKeyboardShortcuts
        basePath="blog"
        previous={previous ?? null}
        next={next ?? null}
      />

      <nav
        aria-label="breadcrumb"
        className="flex items-center justify-between py-2"
      >
        <LinkButton href="blog" variant="link" size="sm">
          <ArrowLeftIcon />
          Blog
        </LinkButton>

        <div className="flex items-center gap-2">
          <LLMCopyButtonWithViewOptions markdownUrl={`${urlPost}.mdx`} />

          <ShareMenu url={urlPost} />

          {previous && (
            <Button variant="secondary" size="icon" asChild>
              <Link
                href={`blog/${previous.slug}`}
                aria-label="Previous Article"
              >
                <ArrowLeftIcon />
                <span className="sr-only">Previous</span>
              </Link>
            </Button>
          )}

          {next && (
            <Button variant="secondary" size="icon" asChild>
              <Link href={`blog/${next.slug}`} aria-label="Next Article">
                <span className="sr-only">Next</span>
                <ArrowRightIcon />
              </Link>
            </Button>
          )}
        </div>
      </nav>

      {/* Table of contents navigation */}
      <nav aria-label="Table of Contents">
        <InlineTOC items={toc} />
      </nav>
    </>
  );
}

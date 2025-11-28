import Link from "next/link";

import { PostItemNav } from "@/app/(app)/(docs)/blog/[slug]/_components/post-item-nav";
import { PostItem } from "@/app/(app)/(root)/_components/post-item";
import { cn } from "@/lib/utils";
import type { Post } from "@/services/blog";

export interface BlogSectionProps {
  previous?: Post | null;
  next?: Post | null;
  post: Post;
}

export const BlogPostSection = ({
  previous,
  next,
  post,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"section"> & BlogSectionProps) => {
  return (
    <section
      className={cn(
        "container mx-auto max-w-4xl overflow-x-hidden px-2 pt-24",
        className
      )}
      {...props}
    >
      <PostItemNav previous={previous} next={next} post={post} />
      <PostItem post={post} />
      {(previous || next) && (
        <nav
          aria-label="Related articles"
          className="flex flex-col gap-4 sm:flex-row sm:justify-between"
        >
          {previous && (
            <Link
              href={`blog/${previous.slug}`}
              className="group relative flex flex-1 flex-col overflow-hidden rounded-xl border p-6 text-left transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative z-10 flex flex-col gap-2">
                <span className="flex items-center font-medium text-muted-foreground text-xs uppercase tracking-wider transition-colors group-hover:text-primary">
                  {`← Previous article`}
                </span>
                <span className="font-semibold text-base transition-all group-hover:translate-x-1 group-hover:text-primary">
                  {previous.metadata.title}
                </span>
              </div>
            </Link>
          )}

          {next && (
            <Link
              href={`blog/${next.slug}`}
              className="group relative flex flex-1 flex-col overflow-hidden rounded-xl border p-6 text-right transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative z-10 flex flex-col gap-2">
                <span className="flex items-center justify-end font-medium text-muted-foreground text-xs uppercase tracking-wider transition-colors group-hover:text-primary">
                  {`Next article →`}
                </span>
                <span className="font-semibold text-base transition-all group-hover:translate-x-1 group-hover:text-primary">
                  {next.metadata.title}
                </span>
              </div>
            </Link>
          )}
        </nav>
      )}
    </section>
  );
};

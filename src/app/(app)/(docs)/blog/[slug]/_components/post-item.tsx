import Image from "next/image";

import dayjs from "dayjs";
import { Calendar, Clock, FileText } from "lucide-react";

import { TextToSpeechButton } from "./text-to-speech-button";
import { MDX } from "@/components/shared/mdx";
import { Tag } from "@/components/ui/tag";
import { Prose } from "@/components/ui/typography";
import { PROFILE } from "@/content/profile";
import type { Post } from "@/services/blog";

export function PostItem({ post }: { post: Post }) {
  const wordCount = post.content.split(" ").length;
  const readingTime = Math.ceil(wordCount / 200);
  const publishedDate = dayjs(post.metadata.createdAt);
  const modifiedDate = dayjs(
    post.metadata.updatedAt || post.metadata.createdAt
  );

  return (
    <article
      itemScope
      itemType="https://schema.org/BlogPosting"
      className="overflow-x-hidden px-2"
    >
      {/* Article header with metadata */}
      <div className="mb-8">
        <Prose className="overflow-hidden pt-6">
          {post.metadata.tags && post.metadata.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.metadata.tags.map((tag) => (
                <Tag
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border-0 px-3 py-1 font-medium text-xs"
                  itemProp="keywords"
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          <h1 className="mb-6 font-semibold" itemProp="headline">
            {post.metadata.title}
          </h1>

          {/* Article metadata */}
          <div className="mb-6 text-muted-foreground text-sm">
            <div className="flex flex-wrap items-center gap-4">
              <time
                dateTime={publishedDate.toISOString()}
                itemProp="datePublished"
                className="flex items-center gap-1"
              >
                <Calendar size={18} />
                <span>{publishedDate.format("MMM DD, YYYY")}</span>
              </time>

              {post.metadata.updatedAt && (
                <time
                  dateTime={modifiedDate.toISOString()}
                  itemProp="dateModified"
                  className="flex items-center gap-1"
                >
                  <FileText size={18} />
                  <span>{`Updated: ${modifiedDate.format(
                    "MMM DD, YYYY"
                  )}`}</span>
                </time>
              )}

              <span className="flex items-center gap-1">
                <Clock size={18} />
                <span>{`min read ${readingTime.toString()}`}</span>
              </span>

              <span className="flex items-center gap-1" itemProp="wordCount">
                <span>•</span>
                <span>{`words ${wordCount.toLocaleString()}`}</span>
              </span>

              <TextToSpeechButton className="ml-auto" content={post.content} />

              {post.metadata.category && (
                <span
                  className="rounded-full bg-primary/10 px-2 py-1 text-xs"
                  itemProp="articleSection"
                >
                  {post.metadata.category}
                </span>
              )}
            </div>
          </div>

          {/* Article description */}
          {post.metadata.description && (
            <p className="lead mt-6 mb-6" itemProp="description">
              {post.metadata.description}
            </p>
          )}

          {/* Featured image with proper attributes */}
          {post.metadata.image && (
            <figure className="mb-4">
              <Image
                src={post.metadata.image}
                alt={post.metadata.title}
                priority
                decoding="async"
                fetchPriority="high"
                width={1200}
                height={630}
                className="h-auto w-full rounded-lg"
                itemProp="image"
              />
            </figure>
          )}
        </Prose>
      </div>

      {/* Article body content */}
      <div
        itemProp="articleBody"
        className="prose dark:prose-invert mx-auto mt-10 max-w-4xl overflow-x-hidden"
      >
        <MDX code={post.content} />
      </div>

      {/* Article footer with author and metadata */}
      <div className="mt-12 border-t pt-8">
        <Prose>
          <div className="flex flex-col gap-4">
            <div
              itemProp="author"
              itemScope
              itemType="https://schema.org/Organization"
            >
              <p className="text-muted-foreground text-sm">
                {`Written by ${PROFILE.firstName} ${PROFILE.lastName}. `}
              </p>
              <meta itemProp="url" content={PROFILE.website} />
            </div>
          </div>
        </Prose>
      </div>
    </article>
  );
}

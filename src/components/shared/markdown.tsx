import { MarkdownAsync } from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { UTM_PARAMS } from "@/config/site.config";
import { rehypeAddQueryParams } from "@/lib/rehype-add-query-params";
import { CodeBlock } from "@/components/ui/code-block";
import Mermaid from "@/components/shared/mermaid";
import rehypeSlug from "rehype-slug";
import { rehypeComponent } from "@/lib/rehype-component";
import { visit } from "unist-util-visit";
import { rehypeNpmCommand } from "@/lib/rehype-npm-command";
import { Code, Heading, Prose } from "@/components/ui/typography";
import { ComponentPreview } from "@/components/shared/component-preview";
import { ComponentSource } from "@/components/shared/component-source";
import { CodeCollapsibleWrapper } from "@/components/shared/code-collapsible-wrapper";
import { CodeTabs } from "@/components/shared/code-tabs";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Markdown(props: React.ComponentProps<typeof MarkdownAsync>) {
  const MarkdownComponents: React.ComponentProps<
    typeof MarkdownAsync
  >["components"] & {
    ComponentPreview: typeof ComponentPreview;
    ComponentSource: typeof ComponentSource;
    CodeCollapsibleWrapper: typeof CodeCollapsibleWrapper;
    CodeTabs: typeof CodeTabs;
    Right: React.FC<React.ComponentProps<"span">>;
    Center: React.FC<React.ComponentProps<"div">>;
  } = {
    p: (props: React.ComponentProps<"p">) => <Prose {...props} />,
    h1: (props: React.ComponentProps<"h1">) => <Heading as="h1" {...props} />,
    h2: (props: React.ComponentProps<"h2">) => <Heading as="h2" {...props} />,
    h3: (props: React.ComponentProps<"h3">) => <Heading as="h3" {...props} />,
    h4: (props: React.ComponentProps<"h4">) => <Heading as="h4" {...props} />,
    h5: (props: React.ComponentProps<"h5">) => <Heading as="h5" {...props} />,
    h6: (props: React.ComponentProps<"h6">) => <Heading as="h6" {...props} />,
    ul({ children, ...props }: { children?: React.ReactNode }) {
      return (
        <ul
          className="mb-4 list-disc space-y-2 pl-6 text-sm dark:text-white"
          {...props}
        >
          {children}
        </ul>
      );
    },
    ol({ children, ...props }: { children?: React.ReactNode }) {
      return (
        <ol
          className="mb-4 list-decimal space-y-2 pl-6 text-sm dark:text-white"
          {...props}
        >
          {children}
        </ol>
      );
    },
    li({ children, ...props }: { children?: React.ReactNode }) {
      return (
        <li className="mb-2 text-sm leading-relaxed dark:text-white" {...props}>
          {children}
        </li>
      );
    },
    a({
      children,
      href,
      ...props
    }: {
      children?: React.ReactNode;
      href?: string;
    }) {
      return (
        <a href={href} className="text-blue-400" {...props}>
          {children}
        </a>
      );
    },
    blockquote({ children, ...props }: { children?: React.ReactNode }) {
      return (
        <blockquote
          className="my-4 border-gray-300 border-l-4 py-1 pl-4 text-gray-700 text-sm italic dark:border-gray-700 dark:text-gray-300"
          {...props}
        >
          {children}
        </blockquote>
      );
    },
    table: Table,
    thead: TableHeader,
    tbody: TableBody,
    tr: TableRow,
    th: TableHead,
    td: TableCell,
    code: Code,
    Right: ({ className, ...props }: React.ComponentProps<"span">) => (
      <span
        className={cn("float-right text-muted-foreground text-sm", className)}
        {...props}
      />
    ),
    Center: ({ className, ...props }: React.ComponentProps<"div">) => (
      <div className={cn("text-balance text-center", className)} {...props} />
    ),
    ComponentPreview,
    ComponentSource,
    CodeCollapsibleWrapper,
    CodeTabs,
  };

  return (
    <MarkdownAsync
      components={MarkdownComponents}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[
        rehypeKatex,
        rehypeRaw,
        [
          rehypeExternalLinks,
          { target: "_blank", rel: "nofollow noopener noreferrer" },
        ],
        [rehypeAddQueryParams, UTM_PARAMS],

        [
          rehypeExternalLinks,
          { target: "_blank", rel: "nofollow noopener noreferrer" },
        ],
        rehypeSlug,
        rehypeComponent,
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "pre") {
              const [codeEl] = node.children;
              if (codeEl.tagName !== "code") {
                return;
              }

              node.__rawString__ = codeEl.children?.[0].value;
            }
          });
        },
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "figure") {
              if (!("data-rehype-pretty-code-figure" in node.properties)) {
                return;
              }

              const preElement = node.children.at(-1);
              if (preElement.tagName !== "pre") {
                return;
              }

              preElement.properties["__withMeta__"] =
                node.children.at(0).tagName === "figcaption";
              preElement.properties["__rawString__"] = node.__rawString__;
            }
          });
        },
        rehypeNpmCommand,
        [rehypeAddQueryParams, UTM_PARAMS],
      ]}
      {...props}
    />
  );
}

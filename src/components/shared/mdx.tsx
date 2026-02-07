import { CodeTabs } from "./code-tabs";
import { getIconForLanguageExtension, Icons } from "./icons";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { CodeBlockCommand } from "@/components/shared/code-block-command";
import { CodeCollapsibleWrapper } from "@/components/shared/code-collapsible-wrapper";
import { ComponentPreview } from "@/components/shared/component-preview";
import { ComponentSource } from "@/components/shared/component-source";
import { CopyButton } from "@/components/shared/copy-button";
import { FramedImage, YouTubeEmbed } from "@/components/shared/embed";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Heading } from "@/components/ui/typography";
import { UTM_PARAMS } from "@/config/site.config";
import { rehypeAddQueryParams } from "@/lib/rehype-add-query-params";
import { rehypeNpmCommand } from "@/lib/rehype-npm-command";
import { remarkCodeImport } from "@/lib/remark-code-import";
import type { NpmCommands } from "@/lib/unist";
import { cn } from "@/lib/utils";

export const components: MDXRemoteProps["components"] = {
  h1: (props: React.ComponentProps<"h1">) => <Heading as="h1" {...props} />,
  h2: (props: React.ComponentProps<"h2">) => <Heading as="h2" {...props} />,
  h3: (props: React.ComponentProps<"h3">) => <Heading as="h3" {...props} />,
  h4: (props: React.ComponentProps<"h4">) => <Heading as="h4" {...props} />,
  h5: (props: React.ComponentProps<"h5">) => <Heading as="h5" {...props} />,
  h6: (props: React.ComponentProps<"h6">) => <Heading as="h6" {...props} />,
  table: Table,
  thead: TableHeader,
  tbody: TableBody,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
  figure({ className, ...props }: React.ComponentProps<"figure">) {
    const hasPrettyCode = "data-rehype-pretty-code-figure" in props;

    return <figure className={cn(hasPrettyCode && "not-prose", className)} {...props} />;
  },
  figcaption: ({ children, ...props }: React.ComponentProps<"figcaption">) => {
    const iconExtension =
      "data-language" in props && typeof props["data-language"] === "string"
        ? getIconForLanguageExtension(props["data-language"])
        : null;

    return (
      <figcaption {...props}>
        {iconExtension}
        {children}
      </figcaption>
    );
  },
  pre({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    __withMeta__,
    __rawString__,

    __pnpm__,
    __yarn__,
    __npm__,
    __bun__,

    ...props
  }: React.ComponentProps<"pre"> & {
    __withMeta__?: boolean;
    __rawString__?: string;
  } & NpmCommands) {
    const isNpmCommand = __pnpm__ && __yarn__ && __npm__ && __bun__;

    if (isNpmCommand) {
      return (
        <CodeBlockCommand
          __pnpm__={__pnpm__}
          __yarn__={__yarn__}
          __npm__={__npm__}
          __bun__={__bun__}
        />
      );
    }

    return (
      <>
        <pre {...props} />

        {__rawString__ && (
          <CopyButton
            className="absolute top-2 right-2"
            value={__rawString__}
            // event="copy_code_block"
          />
        )}
      </>
    );
  },
  code: Code,
  ComponentPreview,
  ComponentSource,
  CodeCollapsibleWrapper,
  CodeTabs,
  Steps: (props) => (
    <div
      className="prose-h3:text-wrap prose-h3:text-lg md:ml-3.5 md:border-l md:pl-7.5"
      {...props}
    />
  ),
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3 className={cn("step", className)} {...props} />
  ),
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsListInstallType: () => (
    <TabsList>
      <TabsTrigger className="pr-2.5 pl-2" value="cli">
        <Icons.shadcn />
        shadcn CLI
      </TabsTrigger>

      <TabsTrigger className="px-2.5" value="manual">
        Manual
      </TabsTrigger>
    </TabsList>
  ),
  YouTubeEmbed,
  FramedImage,
  Right: ({ className, ...props }: React.ComponentProps<"span">) => (
    <span className={cn("float-right text-muted-foreground text-sm", className)} {...props} />
  ),
  Center: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div className={cn("text-balance text-center", className)} {...props} />
  ),
};

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkCodeImport],
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: "nofollow noopener noreferrer" }],
      rehypeSlug,
      // rehypeComponent,
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

            preElement.properties.__withMeta__ = node.children.at(0).tagName === "figcaption";
            preElement.properties.__rawString__ = node.__rawString__;
          }
        });
      },
      rehypeNpmCommand,
      [rehypeAddQueryParams, UTM_PARAMS],
    ],
  },
};

export function MDX({ code }: { code: string }) {
  return <MDXRemote source={code} components={components} options={options} />;
}

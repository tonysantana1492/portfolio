"use client";

import type { FC } from "react";

import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  base16AteliersulphurpoolLight,
  tomorrow,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

import { CopyButton } from "@/components/shared/copy-button";

interface ICodeBlock {
  language: string;
  codeContent: string;
  children: React.ReactNode;
}

export const CodeBlock: FC<ICodeBlock> = ({
  language,
  codeContent,
  children,
  ...props
}) => {
  const theme = useTheme();
  return (
    <div
      className="not-prose overflow-hidden border bg-neutral-100 dark:bg-neutral-800"
      {...props}
    >
      <div className="flex items-center justify-between border-neutral-200 border-b bg-neutral-100 px-5 py-2 text-gray-800 text-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-200">
        <span>{language}</span>
        <div className="flex items-center justify-end gap-2">
          <CopyButton value={codeContent} />
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={
          theme.resolvedTheme === "dark"
            ? tomorrow
            : base16AteliersulphurpoolLight
        }
        customStyle={{
          margin: 0,
        }}
        showLineNumbers={true}
        wrapLines={true}
        wrapLongLines={true}
      >
        {codeContent}
      </SyntaxHighlighter>
    </div>
  );
};

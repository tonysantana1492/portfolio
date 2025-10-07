import stripIndent from "strip-indent";
import { visit } from "unist-util-visit";

import fs from "node:fs";
import { EOL } from "node:os";
import path from "node:path";

function extractLines(
  content: string,
  fromLine: number | undefined,
  hasDash: boolean,
  toLine: number | undefined,
  preserveTrailingNewline = false,
) {
  const lines = content.split(EOL);
  const start = fromLine || 1;

  let end: number;
  if (!hasDash) {
    end = start;
  } else if (toLine) {
    end = toLine;
  } else if (lines[lines.length - 1] === "" && !preserveTrailingNewline) {
    end = lines.length - 1;
  } else {
    end = lines.length;
  }

  return lines.slice(start - 1, end).join("\n");
}

interface RemarkCodeImport {
  rootDir?: string;
  preserveTrailingNewline?: boolean;
  removeRedundantIndentations?: boolean;
}

export function remarkCodeImport(options: RemarkCodeImport = {}) {
  // Default rootDir is the "src" directory in the current working directory
  const rootDir = options.rootDir || path.join(process.cwd(), "src");

  if (!path.isAbsolute(rootDir)) {
    throw new Error(`"rootDir" has to be an absolute path`);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation >
  return function transformer(tree: any, file: any) {
    // biome-ignore lint/suspicious/noExplicitAny: < explanation >
    const codes: [any, number | undefined, any][] = [];

    visit(tree, "code", (node, index, parent) => {
      codes.push([node, index, parent]);
    });

    for (const [node] of codes) {
      const fileMeta = (node.meta || "")
        // Allow escaping spaces
        .split(/(?<!\\) /g)
        .find((meta: string) => meta.startsWith("file="));

      if (!fileMeta) {
        continue;
      }

      const res =
        // @ts-expect-error
        /^file=(?<path>.+?)(?:(?:#(?:L(?<from>\d+)(?<dash>-)?)?)(?:L(?<to>\d+))?)?$/.exec(
          fileMeta,
        );

      if (!res || !res.groups || !res.groups.path) {
        throw new Error(`Unable to parse file path ${fileMeta}`);
      }

      const filePath = res.groups.path;

      const fromLine = res.groups.from
        ? parseInt(res.groups.from, 10)
        : undefined;

      const hasDash = !!res.groups.dash || fromLine === undefined;

      const toLine = res.groups.to ? parseInt(res.groups.to, 10) : undefined;

      const normalizedFilePath = filePath
        .replace(/^@/, rootDir)
        .replace(/\\ /g, " ");

      const fileAbsPath = path.resolve(file.dirname, normalizedFilePath);

      const relativePathFromRootDir = path.relative(rootDir, fileAbsPath);

      if (
        !rootDir ||
        relativePathFromRootDir.startsWith(`..${path.sep}`) ||
        path.isAbsolute(relativePathFromRootDir)
      ) {
        throw new Error(
          `Attempted to import code from "${fileAbsPath}", which is outside from the rootDir "${rootDir}"`,
        );
      }

      const fileContent = fs.readFileSync(fileAbsPath, "utf8");

      node.value = extractLines(
        fileContent,
        fromLine,
        hasDash,
        toLine,
        options.preserveTrailingNewline,
      );

      if (options.removeRedundantIndentations) {
        node.value = stripIndent(node.value);
      }
    }
  };
}

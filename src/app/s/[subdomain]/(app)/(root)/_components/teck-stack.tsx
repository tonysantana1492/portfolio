import Image from "next/image";

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";
import { SimpleTooltip } from "@/components/ui/tooltip";
import type { Profile } from "@/dtos/profile.dto";
import { cn } from "@/lib/utils";

export function TeckStack({
  profile,
  className,
}: React.ComponentProps<typeof Panel> & { profile: Profile }) {
  const techStack = profile.sections.techStack;
  const items = techStack?.items ?? [];
  const name = techStack?.name ?? "";
  const id = techStack?.id ?? "";

  return (
    <Panel className={className} id={id}>
      <PanelHeader>
        <PanelTitle>{name}</PanelTitle>
      </PanelHeader>

      <PanelContent
        className={cn(
          "[--pattern-foreground:var(--color-zinc-950)]/5 dark:[--pattern-foreground:var(--color-white)]/5",
          "bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-center bg-size-[10px_10px]",
          "bg-zinc-950/0.75 dark:bg-white/0.75",
        )}
      >
        <ul className="flex select-none flex-wrap gap-4">
          {items.map((tech) => {
            return (
              <li key={tech.key} className="flex">
                <SimpleTooltip content={tech.title}>
                  <a
                    href={tech.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tech.title}
                  >
                    {tech.theme ? (
                      <>
                        <Image
                          src={`https://assets.chanhdai.com/images/tech-stack-icons/${tech.key}-light.svg`}
                          alt={`${tech.title} light icon`}
                          width={32}
                          height={32}
                          className="hidden [html.light_&]:block"
                          unoptimized
                        />
                        <Image
                          src={`https://assets.chanhdai.com/images/tech-stack-icons/${tech.key}-dark.svg`}
                          alt={`${tech.title} dark icon`}
                          width={32}
                          height={32}
                          className="hidden [html.dark_&]:block"
                          unoptimized
                        />
                      </>
                    ) : (
                      <Image
                        src={`https://assets.chanhdai.com/images/tech-stack-icons/${tech.key}.svg`}
                        alt={`${tech.title} icon`}
                        width={32}
                        height={32}
                        unoptimized
                      />
                    )}
                    <span className="sr-only">{tech.title}</span>
                  </a>
                </SimpleTooltip>
              </li>
            );
          })}
        </ul>
      </PanelContent>
    </Panel>
  );
}

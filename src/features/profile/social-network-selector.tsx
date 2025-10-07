"use client";

import { FormItem, FormMessage } from "@/components/ui/form";
import { SOCIAL_NETWORKS } from "@/content/social-networks";
import { cn } from "@/lib/utils";

interface SocialNetworkSelectorProps {
  socialNetwork?: string;
  onNetworkChange: (networkId: string) => void;
  className?: string;
}

export function SocialNetworkSelector({
  socialNetwork,
  onNetworkChange,
  className,
}: SocialNetworkSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <FormItem>
        <div className="flex flex-wrap gap-2">
          {SOCIAL_NETWORKS.map((network) => {
            const isSelected = socialNetwork?.includes(network.baseUrl);
            const IconComponent = network.icon;

            return (
              <button
                key={network.id}
                type="button"
                onClick={() => onNetworkChange(network.baseUrl)}
                className={cn(
                  "relative flex items-center gap-2 rounded-md border px-3 py-2 font-medium text-xs transition-all hover:border-foreground/20",
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border/50 text-muted-foreground hover:text-foreground",
                )}
                title={`Select ${network.name}`}
              >
                <IconComponent className="h-4 w-4 shrink-0" />
              </button>
            );
          })}
        </div>
        <FormMessage />
      </FormItem>
    </div>
  );
}

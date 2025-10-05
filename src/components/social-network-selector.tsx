"use client";

import { ExternalLink } from "lucide-react";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { FormItem, FormMessage } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

// Instagram icon (since it's missing from icons.tsx)
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
      fill="currentColor"
    />
  </svg>
);

// Facebook icon (since it's missing from icons.tsx)
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      fill="currentColor"
    />
  </svg>
);

export interface SocialNetwork {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  baseUrl: string;
  placeholder: string;
  color: string;
  usernameRegex: RegExp;
  urlPatterns: string[];
}

export const SOCIAL_NETWORKS: SocialNetwork[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Icons.linkedin,
    baseUrl: "https://linkedin.com/in/",
    placeholder: "tu-usuario",
    color:
      "hover:bg-blue-50 hover:border-blue-200 data-[selected=true]:bg-blue-50 data-[selected=true]:border-blue-500",
    usernameRegex:
      /(?:linkedin\.com|www\.linkedin\.com)\/in\/([a-zA-Z0-9\-_.]+)/i,
    urlPatterns: ["linkedin.com/in/", "www.linkedin.com/in/"],
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: Icons.x,
    baseUrl: "https://twitter.com/",
    placeholder: "tu-usuario",
    color:
      "hover:bg-gray-50 hover:border-gray-200 data-[selected=true]:bg-gray-50 data-[selected=true]:border-gray-500",
    usernameRegex:
      /(?:twitter\.com|x\.com|www\.twitter\.com|www\.x\.com)\/([a-zA-Z0-9_]+)/i,
    urlPatterns: ["twitter.com/", "x.com/", "www.twitter.com/", "www.x.com/"],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: InstagramIcon,
    baseUrl: "https://instagram.com/",
    placeholder: "tu-usuario",
    color:
      "hover:bg-pink-50 hover:border-pink-200 data-[selected=true]:bg-pink-50 data-[selected=true]:border-pink-500",
    usernameRegex: /(?:instagram\.com|www\.instagram\.com)\/([a-zA-Z0-9_.]+)/i,
    urlPatterns: ["instagram.com/", "www.instagram.com/"],
  },
  {
    id: "github",
    name: "GitHub",
    icon: Icons.github,
    baseUrl: "https://github.com/",
    placeholder: "tu-usuario",
    color:
      "hover:bg-purple-50 hover:border-purple-200 data-[selected=true]:bg-purple-50 data-[selected=true]:border-purple-500",
    usernameRegex: /(?:github\.com|www\.github\.com)\/([a-zA-Z0-9\-_.]+)/i,
    urlPatterns: ["github.com/", "www.github.com/"],
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: FacebookIcon,
    baseUrl: "https://facebook.com/",
    placeholder: "tu-usuario",
    color:
      "hover:bg-blue-50 hover:border-blue-200 data-[selected=true]:bg-blue-50 data-[selected=true]:border-blue-500",
    usernameRegex: /(?:facebook\.com|www\.facebook\.com)\/([a-zA-Z0-9.]+)/i,
    urlPatterns: ["facebook.com/", "www.facebook.com/"],
  },
];

interface SocialNetworkSelectorProps {
  value?: string;
  socialUsername?: string;
  onNetworkChange: (networkId: string) => void;
  onUsernameChange: (username: string) => void;
  className?: string;
}

export function SocialNetworkSelector({
  value,
  socialUsername = "",
  onNetworkChange,
  onUsernameChange,
  className,
}: SocialNetworkSelectorProps) {
  const selectedNetwork = SOCIAL_NETWORKS.find((network) =>
    value?.includes(network.baseUrl)
  );

  return (
    <div className={cn("space-y-3", className)}>
      <FormItem>
        {/* <FormLabel className="font-medium text-sm">Red Social</FormLabel> */}

        <div className="flex flex-wrap gap-2">
          {SOCIAL_NETWORKS.map((network) => {
            const isSelected = value?.includes(network.baseUrl);
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
                    : "border-border/50 text-muted-foreground hover:text-foreground"
                )}
                title={`Select ${network.name}`}
              >
                <IconComponent className="h-4 w-4 shrink-0" />
                {/* <span className="hidden sm:inline">{network.name}</span> */}
              </button>
            );
          })}
        </div>
        <FormMessage />
      </FormItem>

      {selectedNetwork && (
        <InputGroup className="w-full">
          <InputGroupInput
            placeholder={selectedNetwork.placeholder}
            value={socialUsername}
            onChange={(e) => {
              const newValue = e.target.value;
              onUsernameChange(newValue);
            }}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              onUsernameChange(target.value);
            }}
            className="text-sm"
          />
          <InputGroupAddon align="inline-start">
            <div className="flex items-center gap-1.5">
              <selectedNetwork.icon className="h-3.5 w-3.5" />
              <InputGroupText className="text-muted-foreground text-xs">
                {selectedNetwork.baseUrl.replace("https://", "")}
              </InputGroupText>
            </div>
          </InputGroupAddon>

          {socialUsername && (
            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() =>
                  window.open(
                    selectedNetwork.baseUrl + socialUsername,
                    "_blank"
                  )
                }
                title="Create Profile"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </InputGroupAddon>
          )}
        </InputGroup>
      )}
    </div>
  );
}

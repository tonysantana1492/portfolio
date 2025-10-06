import { Icons } from "@/components/shared/icons";

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
    placeholder: "your-username",
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
    placeholder: "your-username",
    color:
      "hover:bg-gray-50 hover:border-gray-200 data-[selected=true]:bg-gray-50 data-[selected=true]:border-gray-500",
    usernameRegex:
      /(?:twitter\.com|x\.com|www\.twitter\.com|www\.x\.com)\/([a-zA-Z0-9_]+)/i,
    urlPatterns: ["twitter.com/", "x.com/", "www.twitter.com/", "www.x.com/"],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Icons.instagram,
    baseUrl: "https://instagram.com/",
    placeholder: "your-username",
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
    placeholder: "your-username",
    color:
      "hover:bg-purple-50 hover:border-purple-200 data-[selected=true]:bg-purple-50 data-[selected=true]:border-purple-500",
    usernameRegex: /(?:github\.com|www\.github\.com)\/([a-zA-Z0-9\-_.]+)/i,
    urlPatterns: ["github.com/", "www.github.com/"],
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Icons.facebook,
    baseUrl: "https://facebook.com/",
    placeholder: "your-username",
    color:
      "hover:bg-blue-50 hover:border-blue-200 data-[selected=true]:bg-blue-50 data-[selected=true]:border-blue-500",
    usernameRegex: /(?:facebook\.com|www\.facebook\.com)\/([a-zA-Z0-9.]+)/i,
    urlPatterns: ["facebook.com/", "www.facebook.com/"],
  },
];

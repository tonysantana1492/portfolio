import { use } from "react";

import {
  Glimpse,
  GlimpseContent,
  GlimpseDescription,
  GlimpseImage,
  GlimpseTitle,
  GlimpseTrigger,
} from "@/components/shared/glimpse";
import { glimpse } from "@/components/shared/glimpse/server";
import { cn } from "@/lib/utils";

interface IProps {
  href: string | undefined;
  children: React.ReactNode;
  className: string;
}

export const PreviewLink = ({ href, children, className, ...props }: IProps) => {
  const data = use(glimpse(href ?? ""));
  const title = data.title ?? "Image";
  const image = data.image ?? "images/apple-touch-icon.png";

  return (
    <Glimpse closeDelay={0} openDelay={0}>
      <GlimpseTrigger asChild>
        <a className={cn("font-medium text-primary underline", className)} href={href} {...props}>
          {typeof children === "string" ? data.title : children}
        </a>
      </GlimpseTrigger>
      <GlimpseContent className="w-80">
        <GlimpseImage alt={title} src={image} />
        <GlimpseTitle>{data.title}</GlimpseTitle>
        <GlimpseDescription>{data.description}</GlimpseDescription>
      </GlimpseContent>
    </Glimpse>
  );
};

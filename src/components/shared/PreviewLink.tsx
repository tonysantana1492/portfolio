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

interface IData {
  title: string | null;
  description: string | null;
  image: string | null;
}

interface IProps {
  href: string | undefined;
  children: React.ReactNode;
  className: string;
}

export const PreviewLink = ({
  href,
  children,
  className,
  ...props
}: IProps) => {
  const data = use(glimpse(href ?? ""));

  return (
    <Glimpse closeDelay={0} openDelay={0}>
      <GlimpseTrigger asChild>
        <a
          className={cn("font-medium text-primary underline", className)}
          href={href}
          {...props}
        >
          {typeof children === "string" ? data.title : children}
        </a>
      </GlimpseTrigger>
      <GlimpseContent className="w-80">
        <GlimpseImage src={data.image ?? "images/apple-touch-icon.png"} />
        <GlimpseTitle>{data.title}</GlimpseTitle>
        <GlimpseDescription>{data.description}</GlimpseDescription>
      </GlimpseContent>
    </Glimpse>
  );
};

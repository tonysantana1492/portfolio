"use client";

import { useState } from "react";

import { useMotionValueEvent, useScroll } from "motion/react";

export function SiteHeaderWrapper(props: React.ComponentProps<"header">) {
  const { scrollY } = useScroll();

  const [affix, setAffix] = useState(false);

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    setAffix(latestValue >= 8);
  });

  return <header data-affix={affix} {...props} />;
}

"use client";

import { useEffect, useRef, useState } from "react";

import { usePathname } from "next/navigation";

import { useMotionValueEvent, useScroll } from "motion/react";
import * as motion from "motion/react-m";

import { Logo } from "@/components/header/logo";

export function SiteHeaderMark() {
  const pathname = usePathname();
  return pathname === "/" ? <MarkMotion /> : <Logo />;
}

function MarkMotion() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const distanceRef = useRef(160);

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    setVisible(latestValue >= distanceRef.current);
  });

  useEffect(() => {
    const coverMark = document.getElementById("js-cover-logo");
    if (!coverMark) {
      console.warn("Element with id 'js-cover-logo' not found");
      return;
    }

    distanceRef.current = calcDistance(coverMark);

    const resizeObserver = new ResizeObserver(() => {
      if (coverMark && document.contains(coverMark)) {
        distanceRef.current = calcDistance(coverMark);
      }
    });
    resizeObserver.observe(coverMark);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 256"
      initial={{
        opacity: 0,
        transform: "translateY(8px)",
      }}
      animate={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(8px)",
      }}
      transition={{ duration: 0.3 }}
    >
      <Logo className="h-8 w-8" />
    </motion.svg>
  );
}

const calcDistance = (el: HTMLElement | null) => {
  if (!el) {
    console.warn("calcDistance called with null element");
    return 160; // Return default distance
  }

  const rect = el.getBoundingClientRect();
  const scrollTop = document.documentElement.scrollTop;
  const headerHeight = 56;
  return scrollTop + rect.top + rect.height - headerHeight;
};

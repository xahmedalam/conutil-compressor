"use client";

import { InView } from "@/components/motion-primitives/in-view";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
};

const variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function Reveal({
  children,
  className,
  delay = 0,
  as = "section",
}: RevealProps) {
  return (
    <InView
      as={as}
      className={className}
      variants={variants}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      once
    >
      {children}
    </InView>
  );
}

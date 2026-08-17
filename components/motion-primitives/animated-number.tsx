"use client";
import { cn } from "@/lib/utils";
import { motion, SpringOptions, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  format?: (value: number) => string;
  active?: boolean;
};

export function AnimatedNumber({
  value,
  className,
  springOptions,
  format = (current) => Math.round(current).toLocaleString(),
  active = true,
}: AnimatedNumberProps) {
  const spring = useSpring(0, {
    bounce: 0,
    stiffness: 80,
    damping: 18,
    ...springOptions,
  });
  const display = useTransform(spring, (current) => format(current));

  useEffect(() => {
    if (active) {
      spring.set(value);
    }
  }, [spring, value, active]);

  return (
    <motion.span className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  );
}

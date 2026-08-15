"use client";
import { cn } from "@/lib/utils";
import { motion, SpringOptions, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  format?: (value: number) => string;
};

export function AnimatedNumber({
  value,
  className,
  springOptions,
  format = (current) => Math.round(current).toLocaleString(),
}: AnimatedNumberProps) {
  const spring = useSpring(value, springOptions);
  const display = useTransform(spring, (current) => format(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  );
}

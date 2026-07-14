"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "@posthog/react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN as string, {
      api_host: "/info",
      ui_host: "https://us.posthog.com",
      defaults: "2026-05-30",
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

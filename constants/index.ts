export const GITHUB_FEEDBACK_URL =
  "https://github.com/xahmedalam/conutil/issues" as const;
export const GITHUB_REPO_URL = "https://github.com/xahmedalam/conutil" as const;
export const X_URL = "https://x.com/xahmedalam" as const;
export const AUTHOR_NAME = "Ahmed Alam" as const;

export const navLinks = [
  {
    name: "Feedback",
    href: GITHUB_FEEDBACK_URL,
    newTab: true,
  },
  {
    name: "FAQ",
    href: "/#faq",
    newTab: false,
  },
  {
    name: "GitHub",
    href: GITHUB_REPO_URL,
    newTab: true,
  },
] as const;

export const footerLinks = [
  {
    name: "GitHub",
    href: GITHUB_REPO_URL,
  },
  {
    name: "Legal",
    href: "/legal",
  },
] as const;

export const quickPresets = [
  {
    name: "Best",
    quality: 95,
    format: "jpeg",
    maxWidth: "",
    maxHeight: "",
  },
  {
    name: "HD Best",
    quality: 95,
    format: "jpeg",
    maxWidth: 1920,
    maxHeight: 1920,
  },
  {
    name: "2K Best",
    quality: 95,
    format: "jpeg",
    maxWidth: 2560,
    maxHeight: 2560,
  },
  {
    name: "4K Best",
    quality: 95,
    format: "jpeg",
    maxWidth: 3840,
    maxHeight: 3840,
  },
  {
    name: "Light",
    quality: 70,
    format: "jpeg",
    maxWidth: 1280,
    maxHeight: 1280,
  },
  {
    name: "Balanced",
    quality: 85,
    format: "jpeg",
    maxWidth: 2560,
    maxHeight: 2560,
  },
  {
    name: "Web Optimized",
    quality: 95,
    format: "webp",
    maxWidth: 1920,
    maxHeight: 1920,
  },
] as const;

export const outputFormats = ["jpeg", "webp"] as const;

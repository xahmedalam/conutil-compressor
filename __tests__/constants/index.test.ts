import { describe, it, expect } from "vitest";
import {
  GITHUB_FEEDBACK_URL,
  GITHUB_REPO_URL,
  X_URL,
  AUTHOR_NAME,
  navLinks,
  footerLinks,
  faqs,
} from "@/constants";

describe("constants/index", () => {
  describe("URL constants", () => {
    it("GITHUB_FEEDBACK_URL points to the correct issues page", () => {
      expect(GITHUB_FEEDBACK_URL).toBe(
        "https://github.com/mahmedalam/conutil/issues",
      );
    });

    it("GITHUB_REPO_URL points to the correct repository", () => {
      expect(GITHUB_REPO_URL).toBe("https://github.com/mahmedalam/conutil");
    });

    it("X_URL points to the correct X profile", () => {
      expect(X_URL).toBe("https://x.com/xahmedalam");
    });

    it("AUTHOR_NAME is correct", () => {
      expect(AUTHOR_NAME).toBe("Ahmed Alam");
    });
  });

  describe("navLinks", () => {
    it("is a mutable array (not readonly)", () => {
      expect(Array.isArray(navLinks)).toBe(true);
      // Should be assignable as a plain array
      const copy: typeof navLinks = [...navLinks];
      expect(copy).toHaveLength(navLinks.length);
    });

    it("contains a FAQ link pointing to /#faq", () => {
      const faqLink = navLinks.find((link) => link.name === "FAQ");
      expect(faqLink).toBeDefined();
      expect(faqLink?.href).toBe("/#faq");
      expect(faqLink?.newTab).toBe(false);
    });

    it("contains a Feedback link pointing to GITHUB_FEEDBACK_URL", () => {
      const feedbackLink = navLinks.find((link) => link.name === "Feedback");
      expect(feedbackLink).toBeDefined();
      expect(feedbackLink?.href).toBe(GITHUB_FEEDBACK_URL);
      expect(feedbackLink?.newTab).toBe(true);
    });

    it("contains a GitHub link pointing to GITHUB_REPO_URL", () => {
      const githubLink = navLinks.find((link) => link.name === "GitHub");
      expect(githubLink).toBeDefined();
      expect(githubLink?.href).toBe(GITHUB_REPO_URL);
      expect(githubLink?.newTab).toBe(true);
    });

    it("has 3 links total", () => {
      expect(navLinks).toHaveLength(3);
    });
  });

  describe("footerLinks", () => {
    it("is a mutable array (not readonly)", () => {
      expect(Array.isArray(footerLinks)).toBe(true);
      const copy: typeof footerLinks = [...footerLinks];
      expect(copy).toHaveLength(footerLinks.length);
    });

    it("contains a GitHub link", () => {
      const githubLink = footerLinks.find((link) => link.name === "GitHub");
      expect(githubLink).toBeDefined();
      expect(githubLink?.href).toBe(GITHUB_REPO_URL);
    });

    it("contains a Legal link", () => {
      const legalLink = footerLinks.find((link) => link.name === "Legal");
      expect(legalLink).toBeDefined();
      expect(legalLink?.href).toBe("/legal");
    });

    it("has 2 links total", () => {
      expect(footerLinks).toHaveLength(2);
    });
  });

  describe("faqs", () => {
    it("is an array", () => {
      expect(Array.isArray(faqs)).toBe(true);
    });

    it("has 5 FAQ entries", () => {
      expect(faqs).toHaveLength(5);
    });

    it("every FAQ entry has a question and an answer", () => {
      faqs.forEach((faq) => {
        expect(faq).toHaveProperty("question");
        expect(faq).toHaveProperty("answer");
        expect(typeof faq.question).toBe("string");
        expect(typeof faq.answer).toBe("string");
        expect(faq.question.length).toBeGreaterThan(0);
        expect(faq.answer.length).toBeGreaterThan(0);
      });
    });

    it("first FAQ is about server uploads", () => {
      expect(faqs[0].question).toBe(
        "Are my images uploaded to any server?",
      );
      expect(faqs[0].answer).toContain("browser");
    });

    it("includes a FAQ about supported formats", () => {
      const faq = faqs.find((f) =>
        f.question.toLowerCase().includes("format"),
      );
      expect(faq).toBeDefined();
      expect(faq?.answer).toContain("JPEG");
    });

    it("includes a FAQ about bulk compression", () => {
      const faq = faqs.find((f) =>
        f.question.toLowerCase().includes("multiple"),
      );
      expect(faq).toBeDefined();
      expect(faq?.answer).toContain("drag and drop");
    });

    it("includes a FAQ about pricing/free", () => {
      const faq = faqs.find((f) => f.question.toLowerCase().includes("free"));
      expect(faq).toBeDefined();
      expect(faq?.answer).toContain("MIT License");
    });

    it("includes a FAQ about resizing", () => {
      const faq = faqs.find((f) =>
        f.question.toLowerCase().includes("resize"),
      );
      expect(faq).toBeDefined();
      expect(faq?.answer).toContain("HD");
    });

    it("all FAQ questions are unique", () => {
      const questions = faqs.map((f) => f.question);
      const unique = new Set(questions);
      expect(unique.size).toBe(faqs.length);
    });

    it("no FAQ entry has empty strings", () => {
      faqs.forEach((faq) => {
        expect(faq.question.trim()).not.toBe("");
        expect(faq.answer.trim()).not.toBe("");
      });
    });
  });
});
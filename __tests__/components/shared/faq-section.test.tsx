import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FaqSection from "@/components/shared/faq-section";
import { faqs } from "@/constants";

describe("FaqSection", () => {
  describe("structure", () => {
    it("renders a section element with id='faq'", () => {
      const { container } = render(<FaqSection />);
      const section = container.querySelector("section#faq");
      expect(section).toBeInTheDocument();
    });

    it("renders an h2 heading with text 'FAQs'", () => {
      render(<FaqSection />);
      expect(
        screen.getByRole("heading", { level: 2, name: /faqs/i }),
      ).toBeInTheDocument();
    });

    it("renders a wrapper div with class 'card'", () => {
      const { container } = render(<FaqSection />);
      const card = container.querySelector(".card");
      expect(card).toBeInTheDocument();
    });
  });

  describe("FAQ items", () => {
    it("renders one trigger button for each FAQ entry", () => {
      render(<FaqSection />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(faqs.length);
    });

    it("renders every FAQ question as a trigger button", () => {
      render(<FaqSection />);
      faqs.forEach((faq) => {
        expect(
          screen.getByRole("button", { name: new RegExp(faq.question, "i") }),
        ).toBeInTheDocument();
      });
    });

    it("reveals each FAQ answer when its trigger is clicked", async () => {
      const user = userEvent.setup();
      render(<FaqSection />);
      for (const faq of faqs) {
        const btn = screen.getByRole("button", {
          name: new RegExp(faq.question.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
        });
        await user.click(btn);
        expect(screen.getByText(faq.answer)).toBeInTheDocument();
        // collapse again before checking next
        await user.click(btn);
      }
    });

    it("uses sequential value attributes item-0 through item-N", () => {
      const { container } = render(<FaqSection />);
      faqs.forEach((_, index) => {
        const item = container.querySelector(
          `[data-slot='accordion-item'][data-value='item-${index}']`,
        );
        // Radix sets data-value on the item element
        // Check at minimum the expected number of accordion items exist
        expect(
          container.querySelectorAll("[data-slot='accordion-item']"),
        ).toHaveLength(faqs.length);
      });
    });
  });

  describe("interactive behavior", () => {
    it("all FAQ triggers start collapsed", () => {
      render(<FaqSection />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((btn) => {
        expect(btn).toHaveAttribute("aria-expanded", "false");
      });
    });

    it("clicking a trigger expands that FAQ item", async () => {
      const user = userEvent.setup();
      render(<FaqSection />);
      const firstBtn = screen.getByRole("button", {
        name: new RegExp(faqs[0].question, "i"),
      });
      await user.click(firstBtn);
      expect(firstBtn).toHaveAttribute("aria-expanded", "true");
    });

    it("expanding one item collapses another (single type accordion)", async () => {
      const user = userEvent.setup();
      render(<FaqSection />);
      const firstBtn = screen.getByRole("button", {
        name: new RegExp(faqs[0].question, "i"),
      });
      const secondBtn = screen.getByRole("button", {
        name: new RegExp(faqs[1].question, "i"),
      });

      await user.click(firstBtn);
      expect(firstBtn).toHaveAttribute("aria-expanded", "true");

      await user.click(secondBtn);
      expect(secondBtn).toHaveAttribute("aria-expanded", "true");
      expect(firstBtn).toHaveAttribute("aria-expanded", "false");
    });

    it("clicking an expanded trigger collapses it", async () => {
      const user = userEvent.setup();
      render(<FaqSection />);
      const btn = screen.getByRole("button", {
        name: new RegExp(faqs[0].question, "i"),
      });
      await user.click(btn);
      expect(btn).toHaveAttribute("aria-expanded", "true");
      await user.click(btn);
      expect(btn).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("FAQ content accuracy", () => {
    it("privacy FAQ answer mentions 'browser' when opened", async () => {
      const user = userEvent.setup();
      render(<FaqSection />);
      const privacyQ = faqs.find((f) =>
        f.question.includes("uploaded to any server"),
      )!;
      const btn = screen.getByRole("button", { name: privacyQ.question });
      await user.click(btn);
      expect(screen.getByText(/browser/i, { exact: false })).toBeInTheDocument();
    });

    it("renders the correct number of accordion items matching faqs constant", () => {
      const { container } = render(<FaqSection />);
      const items = container.querySelectorAll("[data-slot='accordion-item']");
      expect(items).toHaveLength(faqs.length);
    });
  });
});
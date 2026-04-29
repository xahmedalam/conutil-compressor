import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

function renderSingleAccordion(defaultValue?: string) {
  return render(
    <Accordion type="single" collapsible defaultValue={defaultValue}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Question One</AccordionTrigger>
        <AccordionContent>Answer One</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

function renderMultipleItems() {
  return render(
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Question One</AccordionTrigger>
        <AccordionContent>Answer One</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Question Two</AccordionTrigger>
        <AccordionContent>Answer Two</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Question Three</AccordionTrigger>
        <AccordionContent>Answer Three</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

describe("Accordion component", () => {
  describe("Accordion root", () => {
    it("renders with data-slot='accordion'", () => {
      const { container } = renderSingleAccordion();
      const root = container.querySelector("[data-slot='accordion']");
      expect(root).toBeInTheDocument();
    });

    it("applies default flex flex-col classes", () => {
      const { container } = renderSingleAccordion();
      const root = container.querySelector("[data-slot='accordion']");
      expect(root).toHaveClass("flex");
      expect(root).toHaveClass("w-full");
      expect(root).toHaveClass("flex-col");
    });

    it("merges additional className onto the root", () => {
      const { container } = render(
        <Accordion type="single" collapsible className="custom-class">
          <AccordionItem value="x">
            <AccordionTrigger>Q</AccordionTrigger>
            <AccordionContent>A</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      const root = container.querySelector("[data-slot='accordion']");
      expect(root).toHaveClass("custom-class");
    });
  });

  describe("AccordionItem", () => {
    it("renders with data-slot='accordion-item'", () => {
      const { container } = renderSingleAccordion();
      const item = container.querySelector("[data-slot='accordion-item']");
      expect(item).toBeInTheDocument();
    });

    it("applies not-last:border-b class", () => {
      const { container } = renderSingleAccordion();
      const item = container.querySelector("[data-slot='accordion-item']");
      expect(item).toHaveClass("not-last:border-b");
    });

    it("merges additional className", () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="x" className="custom-item">
            <AccordionTrigger>Q</AccordionTrigger>
            <AccordionContent>A</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      const item = container.querySelector("[data-slot='accordion-item']");
      expect(item).toHaveClass("custom-item");
    });
  });

  describe("AccordionTrigger", () => {
    it("renders trigger text as a button", () => {
      renderSingleAccordion();
      expect(
        screen.getByRole("button", { name: /question one/i }),
      ).toBeInTheDocument();
    });

    it("renders with data-slot='accordion-trigger'", () => {
      const { container } = renderSingleAccordion();
      const trigger = container.querySelector("[data-slot='accordion-trigger']");
      expect(trigger).toBeInTheDocument();
    });

    it("renders ChevronDown and ChevronUp icons (accordion-trigger-icon slots)", () => {
      const { container } = renderSingleAccordion();
      const icons = container.querySelectorAll(
        "[data-slot='accordion-trigger-icon']",
      );
      expect(icons).toHaveLength(2);
    });

    it("merges additional className on the trigger", () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="x">
            <AccordionTrigger className="my-trigger-class">Q</AccordionTrigger>
            <AccordionContent>A</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      const trigger = container.querySelector("[data-slot='accordion-trigger']");
      expect(trigger).toHaveClass("my-trigger-class");
    });
  });

  describe("AccordionContent", () => {
    it("renders with data-slot='accordion-content'", () => {
      const { container } = renderSingleAccordion("item-1");
      const content = container.querySelector("[data-slot='accordion-content']");
      expect(content).toBeInTheDocument();
    });

    it("renders children inside content", () => {
      renderSingleAccordion("item-1");
      expect(screen.getByText("Answer One")).toBeInTheDocument();
    });

    it("merges additional className on the inner div", () => {
      const { container } = render(
        <Accordion type="single" collapsible defaultValue="x">
          <AccordionItem value="x">
            <AccordionTrigger>Q</AccordionTrigger>
            <AccordionContent className="custom-content">A</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      // The className is applied to the inner div wrapper
      const inner = container.querySelector(".custom-content");
      expect(inner).toBeInTheDocument();
    });
  });

  describe("Accordion open/close behavior", () => {
    it("trigger button is initially closed (not expanded)", () => {
      renderSingleAccordion();
      const btn = screen.getByRole("button", { name: /question one/i });
      expect(btn).toHaveAttribute("aria-expanded", "false");
    });

    it("clicking the trigger opens the accordion item", async () => {
      const user = userEvent.setup();
      renderSingleAccordion();
      const btn = screen.getByRole("button", { name: /question one/i });
      await user.click(btn);
      expect(btn).toHaveAttribute("aria-expanded", "true");
    });

    it("clicking an open trigger closes it (collapsible)", async () => {
      const user = userEvent.setup();
      renderSingleAccordion();
      const btn = screen.getByRole("button", { name: /question one/i });
      await user.click(btn);
      expect(btn).toHaveAttribute("aria-expanded", "true");
      await user.click(btn);
      expect(btn).toHaveAttribute("aria-expanded", "false");
    });

    it("opening one item closes the previous in single mode", async () => {
      const user = userEvent.setup();
      renderMultipleItems();
      const btn1 = screen.getByRole("button", { name: /question one/i });
      const btn2 = screen.getByRole("button", { name: /question two/i });

      await user.click(btn1);
      expect(btn1).toHaveAttribute("aria-expanded", "true");

      await user.click(btn2);
      expect(btn2).toHaveAttribute("aria-expanded", "true");
      expect(btn1).toHaveAttribute("aria-expanded", "false");
    });

    it("renders all trigger labels when multiple items present", () => {
      renderMultipleItems();
      expect(screen.getByText("Question One")).toBeInTheDocument();
      expect(screen.getByText("Question Two")).toBeInTheDocument();
      expect(screen.getByText("Question Three")).toBeInTheDocument();
    });
  });
});
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock all heavy dependencies so the page renders in isolation
vi.mock("@/components/shared/compression-settings-card", () => ({
  default: () => <div data-testid="compression-settings-card" />,
}));

vi.mock("@/components/shared/image-carousel", () => ({
  default: () => <div data-testid="image-carousel" />,
}));

vi.mock("@/components/shared/statistics-section", () => ({
  default: () => <div data-testid="statistics-section" />,
}));

vi.mock("@/components/shared/upload-box", () => ({
  default: () => <div data-testid="upload-box" />,
}));

vi.mock("@/components/shared/faq-section", () => ({
  default: () => <section id="faq" data-testid="faq-section" />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.PropsWithChildren<object>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/core/compressor", () => ({
  processAllImages: vi.fn(),
}));

vi.mock("jszip", () => ({
  default: vi.fn().mockImplementation(() => ({
    file: vi.fn(),
    generateAsync: vi.fn().mockResolvedValue(new Blob()),
  })),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Import Home after all mocks are set up
import Home from "@/app/page";

describe("app/page.tsx – PR changes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("FaqSection integration", () => {
    it("renders the FaqSection component", () => {
      render(<Home />);
      expect(screen.getByTestId("faq-section")).toBeInTheDocument();
    });

    it("FaqSection is placed inside the main element", () => {
      const { container } = render(<Home />);
      const main = container.querySelector("main");
      const faqSection = screen.getByTestId("faq-section");
      expect(main).toContainElement(faqSection);
    });

    it("section with id='faq' is present in the page", () => {
      const { container } = render(<Home />);
      expect(container.querySelector("section#faq")).toBeInTheDocument();
    });
  });

  describe("Author attribution", () => {
    it("displays the hardcoded 'Ahmed' name", () => {
      render(<Home />);
      // The page now has hardcoded "Ahmed" instead of using the AUTHOR_NAME constant
      expect(screen.getByText(/Ahmed/)).toBeInTheDocument();
    });

    it("does not display the full AUTHOR_NAME value 'Ahmed Alam'", () => {
      render(<Home />);
      // page.tsx uses hardcoded "Ahmed" (not importing AUTHOR_NAME = "Ahmed Alam")
      expect(screen.queryByText("Ahmed Alam")).not.toBeInTheDocument();
    });

    it("renders the X handle link @xahmedalam", () => {
      render(<Home />);
      expect(screen.getByText("@xahmedalam")).toBeInTheDocument();
    });

    it("X link points to the correct X_URL", async () => {
      render(<Home />);
      const link = screen.getByText("@xahmedalam").closest("a");
      expect(link).toHaveAttribute("href", "https://x.com/xahmedalam");
    });
  });

  describe("Page structure", () => {
    it("renders the page hero heading", () => {
      render(<Home />);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("renders 'Follow me on X' section heading", () => {
      render(<Home />);
      expect(
        screen.getByRole("heading", { name: /follow me on x/i }),
      ).toBeInTheDocument();
    });
  });
});
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal | ConUtil",
  description:
    "Legal information, privacy notes, terms, and license details for ConUtil.",
};

const sections = [
  {
    title: "Privacy",
    body: "ConUtil processes images locally in your browser. Your files are not uploaded to our servers by this app. If you open external links, those third-party services may collect information under their own policies.",
  },
  {
    title: "Use of the Tool",
    body: "You are responsible for the files you process and download. Please make sure you have the right to use, modify, compress, or convert any images you add to ConUtil.",
  },
  {
    title: "No Warranty",
    body: "ConUtil is provided as-is. We do not guarantee that compression results will meet every requirement, preserve every metadata field, or be suitable for a particular purpose.",
  },
  {
    title: "Limitation of Liability",
    body: "To the maximum extent permitted by law, the maintainers are not liable for losses, damages, or issues arising from use of this tool.",
  },
  {
    title: "License",
    body: "ConUtil is open source under the MIT License. You can review the project repository for the full license text and source code.",
  },
];

export default function LegalPage() {
  return (
    <main className="min-h-screen container mx-auto flex flex-col items-center gap-10 px-4 py-11 md:p-14">
      <section className="flex flex-col items-center gap-4">
        <h1>LEGAL</h1>
        <p>
          Simple legal information for ConUtil, including privacy, terms of use,
          warranty, liability, and license notes.
        </p>
      </section>

      <section className="bg-card border-t border-b border-foreground/25 p-6 space-y-8 md:p-10">
        <p className="text-left text-sm text-muted-foreground">
          Last updated: June 13, 2026
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <article key={section.title} className="space-y-3">
              <h2 className="text-left text-2xl md:text-3xl normal-case">
                {section.title}
              </h2>
              <p className="text-left">{section.body}</p>
            </article>
          ))}
        </div>

        <p className="text-left text-sm text-muted-foreground">
          This page is general information, not legal advice.
        </p>
      </section>
    </main>
  );
}

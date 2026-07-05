import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ConUtil Compressor - IN BROWSER BULK IMAGE COMPRESSOR",
  description:
    "The only local image compressor that doesn't suck or get you into subscription hell, I made this because I was annoyed with popups, subscription, and uploading my images to random sites for just to compress, It's a basic tool that should be local and free.",
  openGraph: {
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ConUtil Compressor - IN BROWSER BULK IMAGE COMPRESSOR",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(archivo.className, "antialiased")}>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

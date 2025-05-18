import { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
    { media: "(prefers-color-scheme: light)", color: "#171717" },
  ],
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  height: "device-height",
  viewportFit: "contain",
};

export const metadata: Metadata = {
  title: "Pwa",
  description: "A Progressive Web App built with Next.js",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["pwa", "next-pwa"],
  authors: [
    {
      name: "the Mohmd",
      url: "https://www.github.com/themohmd",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "apple-icon.png" },
    { rel: "icon", url: "icon-512.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col">
        <div className="p-2 flex gap-2 border-b border-neutral-800">
          <Link className="px-4 py-1 text-sm font-bold bg-neutral-800 rounded-sm" href="/">Note</Link>
          <Link className="px-4 py-1 text-sm font-bold bg-neutral-800 rounded-sm" href="/track">Track</Link>
        </div>
        <div className="grow">{children}</div>
      </body>
    </html>
  );
}

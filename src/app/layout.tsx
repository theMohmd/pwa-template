import { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
    { media: "(prefers-color-scheme: light)", color: "#171717" },
  ],
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Ledger",
  description: "A personal finance app",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["Ledger", "finance", "pwa", "next-pwa"],
  authors: [
    {
      name: "the Mohmd",
      url: "https://www.github.com/themohmd",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "apple-icon.png" },
    { rel: "icon", url: "favicon.ico" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

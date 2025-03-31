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
      <body>{children}</body>
    </html>
  );
}

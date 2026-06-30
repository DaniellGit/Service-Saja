import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Service Saja",
  description: "A simple service tracker for motorcycles and cars.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Service Saja",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#315a4f",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wall",
  description: "A 2008-style wall where anyone can share a short message.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Funnel_Display } from "next/font/google";
import "./globals.css";

const defaultFont = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Emoki",
  description: "A game about emotions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${defaultFont.className} antialiased`}>{children}</body>
    </html>
  );
}

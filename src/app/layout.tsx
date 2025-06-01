import type { Metadata } from "next";
import { Joti_One, Funnel_Display } from "next/font/google";
import "./globals.css";

const gameFont = Joti_One({
  variable: "--font-default",
  subsets: ["latin"],
  weight: "400",
});

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
      <body
        className={`${gameFont.variable} ${defaultFont.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

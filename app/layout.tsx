import type { Metadata } from "next";
import { Montserrat, Staatliches } from "next/font/google";
import { MotionProviders } from "@/lib/motion";
import "./globals.css";

const displayFont = Staatliches({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const bodyFont = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Canceled Co",
  description: "You’ve been canceled. Appeal or embrace it.",
};

const motionPlusToken =
  process.env.MOTION_PLUS_TOKEN ?? process.env.NEXT_PUBLIC_MOTION_PLUS_TOKEN;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        <MotionProviders token={motionPlusToken}>{children}</MotionProviders>
      </body>
    </html>
  );
}

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

const deploymentHost =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const siteUrl = deploymentHost.endsWith("/")
  ? deploymentHost.slice(0, -1)
  : deploymentHost;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Canceled Co",
  description: "You’ve been canceled. Appeal or embrace it.",
  openGraph: {
    title: "Canceled Co",
    description: "You’ve been canceled. Appeal or embrace it.",
    url: siteUrl,
    type: "website",
    images: [
      {
        url: "/og/canceled-co-preview.png",
        width: 1200,
        height: 630,
        alt: "Canceled Co hero preview with red background and cancel stamp.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Canceled Co",
    description: "You’ve been canceled. Appeal or embrace it.",
    images: ["/og/canceled-co-preview.png"],
  },
  icons: {
    icon: ["/favicon.ico", "/icon.png"],
    apple: ["/apple-icon.png"],
  },
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

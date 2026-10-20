import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudFolio — Student Portfolio Platform",
  description: "Deploy your collegiate engineering, design, and research journey to the cloud with custom domains, verified project showcases, and recruiter analytics.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

import CursorSpotlight from "@/components/CursorSpotlight";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-body selection:bg-zinc-950 selection:text-white"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col text-slate-950 font-body relative">
        <CursorSpotlight />
        {children}
      </body>
    </html>
  );
}

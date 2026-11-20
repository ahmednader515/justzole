import type { Metadata } from "next";
import { CrosshairCursor } from "@/components/crosshair-cursor";
import { StructuredData } from "@/components/structured-data";
import { absoluteUrl, siteDescription, siteUrl } from "@/lib/seo";
import "./globals.css";
import "./public-theme.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "For Honor Scripts & Hacks | Just Zole",
    template: "%s | Just Zole",
  },
  description: siteDescription,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": absoluteUrl("/#organization"),
                name: "Just Zole",
                url: absoluteUrl(),
              },
              {
                "@type": "WebSite",
                "@id": absoluteUrl("/#website"),
                name: "Just Zole",
                url: absoluteUrl(),
                description: siteDescription,
                inLanguage: "en",
                publisher: { "@id": absoluteUrl("/#organization") },
              },
            ],
          }}
        />
        {children}
        <CrosshairCursor />
      </body>
    </html>
  );
}

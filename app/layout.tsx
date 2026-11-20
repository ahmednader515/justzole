import type { Metadata } from "next";
import { CrosshairCursor } from "@/components/crosshair-cursor";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Just Zole — Your game. Your edge.",
    template: "%s | Just Zole",
  },
  description:
    "Explore game scripts and tools from the Just Zole community. View features and showcases, then connect with us on Discord.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        <CrosshairCursor />
      </body>
    </html>
  );
}

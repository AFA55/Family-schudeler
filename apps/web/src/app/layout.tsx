import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FamilySync — Quality Family Time, Effortlessly Planned",
  description:
    "Smart scheduling for busy families. Plan activities, discover experiences, and make every moment count — together. 87% of profits help families in need.",
  keywords: [
    "family scheduler",
    "family planner",
    "family calendar",
    "family activities",
    "family time",
    "event planner",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

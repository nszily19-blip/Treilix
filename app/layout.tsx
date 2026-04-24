import type { Metadata } from "next";
import "./globals.css";
import RootShell from "./components/RootShell";
import GoogleAnalytics from "./components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.treilix.com"),
  title: "Treilix",
  description: "Find transport companies in Europe",
  alternates: {
    canonical: "https://www.treilix.com",
  },
  verification: {
    google: "fHwSvCJm6lbcnwE14naTRHsEYl0tRbrNj41eopZpJJQ",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <GoogleAnalytics />
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
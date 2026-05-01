import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootShell from "./components/RootShell";
import GoogleAnalytics from "./components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.treilix.com"),
  title: "Treilix",
  description: "Find transport companies in Europe",
  alternates: {
    canonical: "https://www.treilix.com",
    languages: {
      en: "https://www.treilix.com",
      de: "https://www.treilix.com/de",
    },
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
    <html lang="en" className={inter.className}>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <GoogleAnalytics />
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}

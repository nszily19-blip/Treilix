import type { Metadata } from "next";
import "./globals.css";
import RootShell from "./components/RootShell";

export const metadata: Metadata = {
  title: "Treilix",
   description: "Find transport companies in Europe",
  verification: {
    google: "fHwSvCJm6lbcnwE14naTRHsEYl0tRbrNj41eopZpJJQ",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
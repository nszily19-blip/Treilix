import type { Metadata } from "next";
import Script from "next/script";
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4F8LQR7WER"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4F8LQR7WER');
          `}
        </Script>

        <RootShell>{children}</RootShell>

      </body>
    </html>
  );
}
"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = "G-4F8LQR7WER";

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem("treilix-cookie-consent");
      setEnabled(consent === "accepted");
    };

    checkConsent();
    window.addEventListener("treilix-cookie-consent-changed", checkConsent);

    return () => {
      window.removeEventListener(
        "treilix-cookie-consent-changed",
        checkConsent
      );
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
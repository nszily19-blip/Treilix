"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("treilix-cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("treilix-cookie-consent", "accepted");
    setVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("treilix-cookie-consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 p-4 shadow-2xl backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-slate-700">
          <p className="font-semibold text-slate-900">We use cookies</p>
          <p className="mt-1">
            We use cookies to keep Treilix working properly and improve the user
experience. Read our{" "}
<Link href="/privacy" className="text-blue-600 hover:underline">
  Privacy Policy
</Link>
,{" "}
<Link href="/terms" className="text-blue-600 hover:underline">
  Terms
</Link>{" "}
and{" "}
<Link href="/imprint" className="text-blue-600 hover:underline">
  Imprint
</Link>
.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={rejectCookies}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Reject
          </button>

          <button
            onClick={acceptCookies}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
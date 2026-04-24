"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const isDE = pathname.startsWith("/de");

  const enUrl = isDE ? pathname.slice(3) || "/" : pathname;
  const deUrl = isDE ? pathname : pathname === "/" ? "/de" : `/de${pathname}`;

  return (
    <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1">
      <Link
        href={enUrl}
        className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
          !isDE ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        EN
      </Link>
      <Link
        href={deUrl}
        className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
          isDE ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        DE
      </Link>
    </div>
  );
}

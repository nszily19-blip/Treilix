"use client";

import { Suspense } from "react";
import ClaimContent from "./ClaimContent";

export default function ClaimPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm text-slate-600">Loading claim page...</p>
            </div>
          </div>
        </main>
      }
    >
      <ClaimContent />
    </Suspense>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPageDE() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const supabase = createClient();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/de/update-password`,
    });

    if (error) {
      if (error.message.toLowerCase().includes("rate limit")) {
        setMessage("Zu viele Versuche. Bitte warten Sie einen Moment und versuchen Sie es erneut.");
      } else {
        setMessage("Fehler: " + error.message);
      }
    } else {
      setMessage("Überprüfen Sie Ihre E-Mails für den Zurücksetzen-Link.");
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Passwort vergessen</h1>
            <p className="mt-2 text-sm text-slate-500">
              Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Zurücksetzen-Link
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                E-Mail
              </label>
              <input
                type="email"
                placeholder="sie@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReset()}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Wird gesendet..." : "Zurücksetzen-Link senden"}
            </button>
          </div>

          {message && (
            <p
              className={`mt-5 text-center text-sm ${
                message.toLowerCase().includes("fehler") ||
                message.toLowerCase().includes("zu viele")
                  ? "text-red-600"
                  : "text-emerald-600"
              }`}
            >
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Passwort erinnert?{" "}
            <Link href="/de/login" className="font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700">
              Zurück zur Anmeldung
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

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
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-slate-900">
          Passwort vergessen
        </h1>

        <p className="mb-6 text-center text-sm text-slate-500">
          Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Zurücksetzen-Link.
        </p>

        <input
          type="email"
          placeholder="Ihre E-Mail-Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Wird gesendet..." : "Zurücksetzen-Link senden"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.toLowerCase().includes("fehler") ||
              message.toLowerCase().includes("zu viele")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-5 text-center">
          <Link
            href="/de/login"
            className="text-sm text-blue-600 hover:underline"
          >
            Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    </main>
  );
}

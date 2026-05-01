"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPageDE() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pw: string) => {
    if (pw.length < 8) return "Das Passwort muss mindestens 8 Zeichen lang sein.";
    if (!/[A-Z]/.test(pw)) return "Das Passwort muss einen Großbuchstaben enthalten.";
    if (!/[0-9]/.test(pw)) return "Das Passwort muss eine Zahl enthalten.";
    return null;
  };

  const handleSignup = async () => {
    const supabase = createClient();

    setMessage("");

    const validationError = validatePassword(password);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    if (password !== confirm) {
      setMessage("Die Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("rate limit")) {
        setMessage("Zu viele Versuche. Bitte warten Sie einen Moment und versuchen Sie es erneut.");
      } else {
        setMessage("Fehler: " + error.message);
      }
      return;
    }

    setMessage("Konto erstellt. Bitte überprüfen Sie Ihre E-Mails.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Konto erstellen</h1>
            <p className="mt-2 text-sm text-slate-500">
              Registrieren Sie sich, um Ihre Unternehmen auf Treilix zu verwalten
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Passwort
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Passwort erstellen"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-150 hover:text-slate-600"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Passwort bestätigen
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Passwort wiederholen"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
              <p className="font-medium text-slate-700">Das Passwort muss:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>mindestens 8 Zeichen lang sein</li>
                <li>einen Großbuchstaben enthalten</li>
                <li>eine Zahl enthalten</li>
              </ul>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Konto wird erstellt..." : "Registrieren"}
            </button>
          </div>

          {message && (
            <p
              className={`mt-4 text-center text-sm ${
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
            Bereits ein Konto?{" "}
            <Link href="/de/login" className="font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700">
              Anmelden
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

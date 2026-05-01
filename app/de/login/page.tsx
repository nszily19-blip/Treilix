"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPageDE() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const supabase = createClient();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/de/dashboard";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Willkommen zurück</h1>
            <p className="mt-2 text-sm text-slate-500">
              Melden Sie sich bei Ihrem Treilix-Konto an
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Passwort
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ihr Passwort eingeben"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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

            <div className="text-right">
              <Link
                href="/de/forgot-password"
                className="text-sm font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700"
              >
                Passwort vergessen?
              </Link>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Anmelden..." : "Anmelden"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Noch kein Konto?{" "}
            <Link href="/de/signup" className="font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700">
              Registrieren
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

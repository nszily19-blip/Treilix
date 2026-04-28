"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function UpdatePasswordPageDE() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password.trim()) {
      setMessage("Bitte geben Sie ein neues Passwort ein.");
      return;
    }

    if (password.length < 6) {
      setMessage("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    if (password !== confirm) {
      setMessage("Die Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setMessage("Fehler: " + error.message);
    } else {
      setMessage("Passwort erfolgreich aktualisiert.");

      setTimeout(() => {
        router.push("/de/login");
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-slate-900">
          Neues Passwort festlegen
        </h1>

        <p className="mb-6 text-center text-sm text-slate-500">
          Geben Sie Ihr neues Passwort ein.
        </p>

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Neues Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-slate-500"
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Passwort bestätigen"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mb-4 w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Wird aktualisiert..." : "Passwort aktualisieren"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.toLowerCase().includes("fehler")
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

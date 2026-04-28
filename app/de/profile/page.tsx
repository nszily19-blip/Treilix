"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthUser = {
  id: string;
  email?: string | null;
  created_at?: string | null;
} | null;

export default function ProfilePageDE() {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(
        user
          ? {
              id: user.id,
              email: user.email,
              created_at: user.created_at,
            }
          : null
      );

      setLoading(false);
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/de";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
          <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-5 w-64 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-5 w-52 animate-pulse rounded bg-slate-200" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Nicht angemeldet
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Bitte melden Sie sich an, um Ihr Profil anzuzeigen.
          </p>

          <div className="mt-6">
            <Link
              href="/de/login"
              className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Zur Anmeldung
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Mein Profil</h1>
          <p className="mt-2 text-sm text-slate-600">
            Verwalten Sie Ihr Konto und greifen Sie auf Ihren Treilix-Bereich zu.
          </p>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Kontoinformationen</h2>

          <div className="mt-5 space-y-4 text-sm text-slate-700">
            <div>
              <p className="text-slate-500">E-Mail</p>
              <p className="mt-1 break-all">{user.email || "Nicht verfügbar"}</p>
            </div>

            <div>
              <p className="text-slate-500">Benutzer-ID</p>
              <p className="mt-1 break-all">{user.id}</p>
            </div>

            <div>
              <p className="text-slate-500">Konto erstellt</p>
              <p className="mt-1">
                {user.created_at
                  ? new Date(user.created_at).toLocaleString("de-DE")
                  : "Nicht verfügbar"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Schnellzugriff</h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/de/dashboard"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Zum Dashboard
            </Link>

            <Link
              href="/de/forgot-password"
              className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Passwort zurücksetzen
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Abmelden
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

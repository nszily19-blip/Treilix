"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthUser = {
  id: string;
  email?: string | null;
  created_at?: string | null;
} | null;

export default function ProfilePage() {
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
    window.location.href = "/";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-4 h-5 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-5 w-52 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Not logged in</h1>
          <p className="mt-2 text-sm text-slate-600">
            Please log in to view your profile.
          </p>

          <div className="mt-6">
            <Link
              href="/login"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
            >
              Go to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
          <p className="mt-1.5 text-slate-600">
            Manage your account and access your Treilix workspace.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Account info</h2>

          <div className="mt-5 space-y-4 divide-y divide-slate-100">
            <div className="pb-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Email</p>
              <p className="mt-1 text-sm text-slate-900">{user.email || "Not available"}</p>
            </div>

            <div className="py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">User ID</p>
              <p className="mt-1 break-all text-sm text-slate-900">{user.id}</p>
            </div>

            <div className="pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Account created</p>
              <p className="mt-1 text-sm text-slate-900">
                {user.created_at
                  ? new Date(user.created_at).toLocaleString()
                  : "Not available"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
            >
              Go to dashboard
            </Link>

            <Link
              href="/forgot-password"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
            >
              Reset password
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-slate-800"
            >
              Log out
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

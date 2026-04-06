"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type UserType = {
  id: string;
  email?: string | null;
} | null;

type NavbarAuthProps = {
  mobile?: boolean;
};

export default function NavbarAuth({ mobile = false }: NavbarAuthProps) {
  const [user, setUser] = useState<UserType>(null);
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
            }
          : null
      );

      setLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(
          session?.user
            ? {
                id: session.user.id,
                email: session.user.email,
              }
            : null
        );
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const userLabel = useMemo(() => {
    if (!user?.email) return "Profile";
    return user.email.split("@")[0];
  }, [user]);

  const userInitial = useMemo(() => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  }, [user]);

  if (loading) return null;

  if (mobile) {
    if (!user) {
      return (
        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
          >
            Sign up
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {userInitial}
          </span>
          <span>{userLabel}</span>
        </Link>

        <Link
          href="/dashboard"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Dashboard
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/profile"
        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          {userInitial}
        </span>
        <span className="hidden xl:inline">{userLabel}</span>
      </Link>

      <Link
        href="/dashboard"
        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Dashboard
      </Link>

      <button
        onClick={handleLogout}
        className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
      >
        Logout
      </button>
    </div>
  );
}
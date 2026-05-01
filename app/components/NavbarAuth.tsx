"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UserType = {
  id: string;
  email?: string | null;
} | null;

type NavbarAuthProps = {
  mobile?: boolean;
};

export default function NavbarAuth({ mobile = false }: NavbarAuthProps) {
  const pathname = usePathname();
  const isDE = pathname.startsWith("/de");
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
    window.location.href = isDE ? "/de" : "/";
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
            href={isDE ? "/de/login" : "/login"}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
          >
            {isDE ? "Anmelden" : "Login"}
          </Link>

          <Link
            href={isDE ? "/de/signup" : "/signup"}
            className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-700"
          >
            {isDE ? "Registrieren" : "Sign up"}
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <Link
          href={isDE ? "/de/profile" : "/profile"}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
            {userInitial}
          </span>
          <span>{userLabel}</span>
        </Link>

        <Link
          href={isDE ? "/de/dashboard" : "/dashboard"}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
        >
          Dashboard
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-slate-800"
        >
          {isDE ? "Abmelden" : "Logout"}
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href={isDE ? "/de/login" : "/login"}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
        >
          {isDE ? "Anmelden" : "Login"}
        </Link>

        <Link
          href={isDE ? "/de/signup" : "/signup"}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-700"
        >
          {isDE ? "Registrieren" : "Sign up"}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={isDE ? "/de/profile" : "/profile"}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
          {userInitial}
        </span>
        <span className="hidden xl:inline">{userLabel}</span>
      </Link>

      <Link
        href={isDE ? "/de/dashboard" : "/dashboard"}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
      >
        Dashboard
      </Link>

      <button
        onClick={handleLogout}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-slate-800"
      >
        {isDE ? "Abmelden" : "Logout"}
      </button>
    </div>
  );
}

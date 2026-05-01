"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password.trim()) {
      setMessage("Please enter a new password.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Password updated successfully.");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Set new password</h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your new password below
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-150 hover:text-slate-600"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              onClick={handleUpdatePassword}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </div>

          {message && (
            <p
              className={`mt-5 text-center text-sm ${
                message.toLowerCase().includes("error")
                  ? "text-red-600"
                  : "text-emerald-600"
              }`}
            >
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link href="/login" className="font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

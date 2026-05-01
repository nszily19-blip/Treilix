"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pw: string) => {
    if (pw.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pw)) return "Password must contain a capital letter.";
    if (!/[0-9]/.test(pw)) return "Password must contain a number.";
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
      setMessage("Passwords do not match.");
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
        setMessage("Too many attempts. Please wait a little and try again.");
      } else {
        setMessage("Error: " + error.message);
      }
      return;
    }

    setMessage("Account created. Check your email.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign up to manage your companies on Treilix
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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
                Confirm password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Repeat your password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
              <p className="font-medium text-slate-700">Password must:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>be at least 8 characters</li>
                <li>contain a capital letter</li>
                <li>contain a number</li>
              </ul>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          {message && (
            <p
              className={`mt-4 text-center text-sm ${
                message.toLowerCase().includes("error") ||
                message.toLowerCase().includes("too many")
                  ? "text-red-600"
                  : "text-emerald-600"
              }`}
            >
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

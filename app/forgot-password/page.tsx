"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const supabase = createClient();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update-password",
    });

    if (error) {
      if (error.message.toLowerCase().includes("rate limit")) {
        setMessage("Too many attempts. Please wait a little and try again.");
      } else {
        setMessage("Error: " + error.message);
      }
    } else {
      setMessage("Check your email for the reset link.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-slate-900">
          Forgot password
        </h1>

        <p className="mb-6 text-center text-sm text-slate-500">
          Enter your email address and we will send you a reset link.
        </p>

        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.toLowerCase().includes("error") ||
              message.toLowerCase().includes("too many")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-5 text-center">
          <Link
            href="/login"
            className="text-sm text-blue-600 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
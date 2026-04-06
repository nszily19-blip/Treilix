"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Company = {
  id: string;
  company_name: string | null;
  country: string | null;
  city: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  owner_id: string | null;
  service_countries: string[] | null;
  transport_types: string[] | null;
  vehicle_types: string[] | null;
};

type UserInfo = {
  id: string;
  email?: string | null;
} | null;

function normalizeWebsite(url: string | null) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

export default function CompanyContactPage() {
  const params = useParams();
  const id = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [user, setUser] = useState<UserInfo>(null);
  const [loading, setLoading] = useState(true);

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const supabase = createClient();

    const loadData = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser({
          id: user.id,
          email: user.email,
        });

        if (user.email) {
          setSenderEmail(user.email);
        }
      }

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setCompany(data as Company);
      } else {
        setCompany(null);
      }

      setLoading(false);
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const isOwner = user?.id === company?.owner_id;

  const websiteUrl = useMemo(
    () => normalizeWebsite(company?.website || null),
    [company]
  );

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!company) return;

    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) {
      setErrorMsg("Please fill in name, email and message.");
      setSuccessMsg("");
      return;
    }

    setSending(true);
    setErrorMsg("");
    setSuccessMsg("");

    const supabase = createClient();

    const payload = {
      company_id: company.id,
      company_owner_id: company.owner_id,
      sender_user_id: user?.id ?? null,
      sender_name: senderName.trim(),
      sender_email: senderEmail.trim(),
      sender_phone: senderPhone.trim() || null,
      message: message.trim(),
      status: "new",
    };

    const { error } = await supabase.from("company_inquiries").insert([payload]);

    if (error) {
      console.error("INQUIRY INSERT ERROR:", error);
      setErrorMsg(error.message);
      setSending(false);
      return;
    }

    const ownerEmail = company.email?.trim();

    if (ownerEmail) {
      try {
        const response = await fetch("/api/send-inquiry-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerEmail,
            companyName: company.company_name || "Unknown company",
            senderName: senderName.trim(),
            senderEmail: senderEmail.trim(),
            senderPhone: senderPhone.trim() || null,
            message: message.trim(),
          }),
        });

        const text = await response.text();

        let result: any = null;

        try {
          result = JSON.parse(text);
        } catch {
          console.error("Email API did not return JSON:", text);
        }

        if (!response.ok) {
          console.error("Email send failed:", result?.error || text);
        }
      } catch (emailErr) {
        console.error("Email request failed:", emailErr);
      }
    }

    setSuccessMsg("Inquiry sent successfully.");
    setMessage("");
    setSenderPhone("");
    setSending(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-5 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-6 h-24 w-full animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Company not found</h1>
          <p className="mt-2 text-sm text-slate-600">
            The company you are looking for does not exist or is no longer available.
          </p>

          <div className="mt-6">
            <Link
              href="/companies"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back to companies
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isOwner) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            You own this company
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            You cannot send an inquiry to your own company profile.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/companies/${company.id}`}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back to company
            </Link>

            <Link
              href="/dashboard"
              className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/companies/${company.id}`}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Back to company
          </Link>

          <Link
            href="/companies"
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            All companies
          </Link>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Contact company
              </div>

              <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
                {company.company_name}
              </h1>

              <p className="mt-3 text-base text-slate-600">
                {company.city || "Unknown city"}, {company.country || "Unknown country"}
              </p>

              {!!company.transport_types?.length && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {company.transport_types.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Visit website
              </a>
            )}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Send inquiry</h2>
            <p className="mt-2 text-sm text-slate-600">
              Your message will be stored in Treilix and emailed to the company.
            </p>

            {successMsg && (
              <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSendInquiry} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    Your name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    Your email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Message
                </label>
                <textarea
                  placeholder="Write your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={7}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send inquiry"}
              </button>
            </form>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Company summary</h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-500">Company</p>
                <p className="mt-1 text-sm text-slate-900">
                  {company.company_name || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Location</p>
                <p className="mt-1 text-sm text-slate-900">
                  {company.city || "Unknown city"}, {company.country || "Unknown country"}
                </p>
              </div>

              {!!company.service_countries?.length && (
                <div>
                  <p className="text-sm font-medium text-slate-500">Service countries</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {company.service_countries.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!!company.vehicle_types?.length && (
                <div>
                  <p className="text-sm font-medium text-slate-500">Vehicle types</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {company.vehicle_types.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-slate-500">Email</p>
                <p className="mt-1 break-all text-sm text-slate-900">
                  {company.email || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Phone</p>
                <p className="mt-1 text-sm text-slate-900">
                  {company.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Description</p>
                <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {company.description || "No description yet."}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
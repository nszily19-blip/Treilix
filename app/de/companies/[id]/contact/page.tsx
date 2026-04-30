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

export default function CompanyContactPageDE() {
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

      let { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", id)
        .maybeSingle();

      if (!data) {
        const fallback = await supabase
          .from("companies")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        data = fallback.data;
        error = fallback.error;
      }

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
      setErrorMsg("Bitte füllen Sie Name, E-Mail und Nachricht aus.");
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
            companyName: company.company_name || "Unbekanntes Unternehmen",
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

    setSuccessMsg("Anfrage erfolgreich gesendet.");
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
          <h1 className="text-2xl font-bold text-slate-900">Unternehmen nicht gefunden</h1>
          <p className="mt-2 text-sm text-slate-600">
            Das gesuchte Unternehmen existiert nicht oder ist nicht mehr verfügbar.
          </p>

          <div className="mt-6">
            <Link
              href="/de/companies"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Alle Unternehmen
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
            Sie sind der Eigentümer dieses Unternehmens
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sie können keine Anfrage an Ihr eigenes Unternehmensprofil senden.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/de/companies/${id}`}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Zurück zum Unternehmen
            </Link>

            <Link
              href="/de/dashboard"
              className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Zum Dashboard
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
            href={`/de/companies/${id}`}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Zurück zum Unternehmen
          </Link>

          <Link
            href="/de/companies"
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Alle Unternehmen
          </Link>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Unternehmen kontaktieren
              </div>

              <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
                {company.company_name}
              </h1>

              <p className="mt-3 text-base text-slate-600">
                {company.city || "Unbekannte Stadt"}, {company.country || "Unbekanntes Land"}
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
                Webseite besuchen
              </a>
            )}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Anfrage senden</h2>
            <p className="mt-2 text-sm text-slate-600">
              Ihre Nachricht wird in Treilix gespeichert und an das Unternehmen per E-Mail gesendet.
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
                    Ihr Name
                  </label>
                  <input
                    type="text"
                    placeholder="Max Mustermann"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    Ihre E-Mail
                  </label>
                  <input
                    type="email"
                    placeholder="sie@beispiel.de"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Telefon
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
                  Nachricht
                </label>
                <textarea
                  placeholder="Schreiben Sie Ihre Nachricht..."
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
                {sending ? "Wird gesendet..." : "Anfrage senden"}
              </button>
            </form>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Unternehmensübersicht</h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-500">Unternehmen</p>
                <p className="mt-1 text-sm text-slate-900">
                  {company.company_name || "Nicht angegeben"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Standort</p>
                <p className="mt-1 text-sm text-slate-900">
                  {company.city || "Unbekannte Stadt"}, {company.country || "Unbekanntes Land"}
                </p>
              </div>

              {!!company.service_countries?.length && (
                <div>
                  <p className="text-sm font-medium text-slate-500">Serviceländer</p>
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
                  <p className="text-sm font-medium text-slate-500">Fahrzeugtypen</p>
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
                <p className="text-sm font-medium text-slate-500">E-Mail</p>
                <p className="mt-1 break-all text-sm text-slate-900">
                  {company.email || "Nicht angegeben"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Telefon</p>
                <p className="mt-1 text-sm text-slate-900">
                  {company.phone || "Nicht angegeben"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Beschreibung</p>
                <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {company.description || "Noch keine Beschreibung."}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

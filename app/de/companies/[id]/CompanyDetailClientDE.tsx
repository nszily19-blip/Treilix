"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Company = {
  id: string;
  slug?: string | null;
  logo_url?: string | null;
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

function getInitials(name?: string | null) {
  if (!name) return "C";
  return name.trim().charAt(0).toUpperCase();
}

function CompanyLogo({
  logoUrl,
  companyName,
}: {
  logoUrl?: string | null;
  companyName?: string | null;
}) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={companyName || "Unternehmenslogo"}
        className="h-20 w-20 rounded-3xl border border-slate-200 bg-white object-cover md:h-24 md:w-24"
      />
    );
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-2xl font-semibold text-slate-500 md:h-24 md:w-24">
      {getInitials(companyName)}
    </div>
  );
}

export default function CompanyDetailClientDE() {
  const params = useParams();
  const id = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [user, setUser] = useState<UserInfo>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser({ id: user.id, email: user.email });
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

  const websiteUrl = useMemo(
    () => normalizeWebsite(company?.website || null),
    [company]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 animate-pulse rounded-3xl bg-slate-200" />
              <div className="flex-1">
                <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-5 w-40 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
            <div className="mt-6 h-24 w-full animate-pulse rounded bg-slate-200" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-5 w-full animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-5 w-5/6 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-5 w-full animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
            </div>
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
              Zurück zur Übersicht
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isOwner = user?.id === company.owner_id;
  const companyPath = `/de/companies/${company.slug || company.id}`;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/de/companies"
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Zurück zur Übersicht
          </Link>

          {isOwner && (
            <Link
              href={`/dashboard/edit-company/${company.id}`}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Unternehmen bearbeiten
            </Link>
          )}
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-4">
                <CompanyLogo
                  logoUrl={company.logo_url}
                  companyName={company.company_name}
                />

                <div className="min-w-0 flex-1">
                  <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Unternehmensprofil
                  </div>

                  <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
                    {company.company_name}
                  </h1>

                  <p className="mt-3 text-base text-slate-600">
                    {company.city || company.country || "Europa"}
                    {company.country && company.city
                      ? `, ${company.country}`
                      : ""}
                  </p>
                </div>
              </div>

              {!!company.service_countries?.length && (
                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Serviceländer
                  </p>
                  <div className="flex flex-wrap gap-2">
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

              {!!company.transport_types?.length && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Transportarten
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {company.transport_types.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!!company.vehicle_types?.length && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Fahrzeugtypen
                  </p>
                  <div className="flex flex-wrap gap-2">
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
            </div>

            <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[240px]">
              {!isOwner && (
                <Link
                  href={`${companyPath}/contact`}
                  className="rounded-2xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Unternehmen kontaktieren
                </Link>
              )}

              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Website besuchen
                </a>
              )}

              {!isOwner && (
                <Link
                  href={`/claim?companyId=${company.id}&name=${encodeURIComponent(
                    company.company_name || ""
                  )}`}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Profil beanspruchen
                </Link>
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Über das Unternehmen</h2>

            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 md:text-base">
              {company.description || "Noch keine Beschreibung vorhanden."}
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Unternehmensdetails</h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-500">Unternehmensland</p>
                <p className="mt-1 text-sm text-slate-900">
                  {company.country || "Keine Angabe"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Stadt</p>
                <p className="mt-1 text-sm text-slate-900">
                  {company.city || "Keine Angabe"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">E-Mail</p>
                <p className="mt-1 break-all text-sm text-slate-900">
                  {company.email || "Keine Angabe"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Telefon</p>
                <p className="mt-1 text-sm text-slate-900">
                  {company.phone || "Keine Angabe"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Website</p>
                {websiteUrl ? (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block break-all text-sm font-medium text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-slate-900">Keine Angabe</p>
                )}
              </div>
            </div>
          </section>
        </div>

        {!isOwner && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Möchten Sie dieses Unternehmen erreichen?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Senden Sie Ihre Anfrage über Treilix und kontaktieren Sie das Unternehmen direkt.
                </p>
              </div>

              <Link
                href={`${companyPath}/contact`}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Anfrage senden
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

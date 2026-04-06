"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Company = {
  id: string;
  company_name: string | null;
  country: string | null;
  city: string | null;
  email: string | null;
  owner_id: string | null;
};

export default function ClaimPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [proof, setProof] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const preloadCompanyId = searchParams.get("companyId") || "";
    const preloadName = searchParams.get("name") || "";

    if (preloadCompanyId) setSelectedCompanyId(preloadCompanyId);
    if (preloadName) setSearch(preloadName);
  }, [searchParams]);

  useEffect(() => {
    const loadCompanies = async () => {
      setLoadingCompanies(true);

      const { data, error } = await supabase
        .from("companies")
        .select("id, company_name, country, city, email, owner_id")
        .order("company_name", { ascending: true });

      if (error) {
        console.error("LOAD CLAIM COMPANIES ERROR:", error.message);
        setCompanies([]);
      } else {
        setCompanies((data as Company[]) || []);
      }

      setLoadingCompanies(false);
    };

    loadCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return companies;

    return companies.filter((company) => {
      const haystack = [
        company.company_name || "",
        company.city || "",
        company.country || "",
        company.email || "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [companies, search]);

  const selectedCompany = useMemo(() => {
    return companies.find((company) => company.id === selectedCompanyId) || null;
  }, [companies, selectedCompanyId]);

  const handleClaim = async () => {
    setSubmitting(true);
    setInfo("");
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Please log in first to submit a claim request.");
      setSubmitting(false);
      return;
    }

    if (!selectedCompanyId) {
      setError("Please select a company.");
      setSubmitting(false);
      return;
    }

    const selected = companies.find((c) => c.id === selectedCompanyId);

    if (!selected) {
      setError("Selected company not found.");
      setSubmitting(false);
      return;
    }

    if (selected.owner_id) {
      setError("This company profile already has an owner. You can still contact support later, but normal claim is not available here.");
      setSubmitting(false);
      return;
    }

    const fullMessage = [message.trim(), proof.trim()]
      .filter(Boolean)
      .join("\n\nProof / additional information:\n");

    const { error } = await supabase.from("claim_requests").insert([
      {
        company_id: selected.id,
        user_id: user.id,
        message: fullMessage || null,
        status: "pending",
      },
    ]);

    setSubmitting(false);

    if (error) {
      setError("Error: " + error.message);
      return;
    }

    setInfo("Claim request sent successfully. We will review it.");
    setMessage("");
    setProof("");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/companies"
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Back to companies
          </Link>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Company ownership
              </div>

              <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
                Claim your company profile
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                If your company is already listed on Treilix, you can request
                ownership of the profile. After approval, you will be able to
                manage the listing and keep your details up to date.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">
                    1. Select company
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Find your company from the directory list.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">
                    2. Add proof
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Tell us why you are the rightful owner or manager.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">
                    3. Wait for review
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    After approval, the company profile will be linked to you.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 md:p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Submit claim request
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Choose the company and send a short explanation.
              </p>

              {info && (
                <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {info}
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    Search company
                  </label>
                  <input
                    type="text"
                    placeholder="Company name, city, country..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    Select company
                  </label>

                  <div className="rounded-2xl border border-slate-200 bg-white">
                    {loadingCompanies ? (
                      <div className="px-4 py-3 text-sm text-slate-500">
                        Loading companies...
                      </div>
                    ) : filteredCompanies.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-500">
                        No matching companies found.
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto">
                        {filteredCompanies.map((company) => {
                          const selected = selectedCompanyId === company.id;

                          return (
                            <button
                              key={company.id}
                              type="button"
                              onClick={() => setSelectedCompanyId(company.id)}
                              className={`flex w-full items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 ${
                                selected
                                  ? "bg-blue-50"
                                  : "bg-white hover:bg-slate-50"
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="font-medium text-slate-900">
                                  {company.company_name || "Unnamed company"}
                                </div>
                                <div className="mt-1 text-sm text-slate-500">
                                  {company.city || "Unknown city"},{" "}
                                  {company.country || "Unknown country"}
                                </div>
                              </div>

                              <div className="shrink-0">
                                {selected ? (
                                  <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-medium text-white">
                                    Selected
                                  </span>
                                ) : company.owner_id ? (
                                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                                    Owned
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                    Available
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {selectedCompany && (
                  <div className="rounded-2xl bg-white px-4 py-4">
                    <p className="text-sm font-medium text-slate-500">
                      Selected company
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {selectedCompany.company_name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {selectedCompany.city || "Unknown city"},{" "}
                      {selectedCompany.country || "Unknown country"}
                    </p>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Tell us why this company belongs to you."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    Proof / additional information
                  </label>
                  <textarea
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                    rows={4}
                    placeholder="For example: company email, website access, public contact details, role in the company..."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleClaim}
                  disabled={submitting}
                  className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? "Sending request..." : "Request claim"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Why claim a profile?
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Claiming lets you manage company details, improve trust, and keep
              your profile accurate for potential clients.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              What should you include?
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The best requests include a short explanation and proof that you
              are authorized to manage the company.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Don’t see your company?
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              If your company is not listed yet, add it first and then manage it
              through your account after approval.
            </p>
            <Link
              href="/add-company"
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Add company →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
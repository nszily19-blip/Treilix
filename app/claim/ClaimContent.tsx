"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Company = {
  id: string;
  company_name: string | null;
  country: string | null;
  city: string | null;
  owner_id: string | null;
};

export default function ClaimContent() {
  const supabase = createClient();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [message, setMessage] = useState("");
  const [proof, setProof] = useState("");

  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preloadCompanyId = params.get("companyId") || "";
    const preloadName = params.get("name") || "";

    if (preloadCompanyId) setSelectedCompanyId(preloadCompanyId);
    if (preloadName) setSearch(preloadName);
  }, []);

  useEffect(() => {
    const loadCompanies = async () => {
      setLoadingCompanies(true);

      const { data, error } = await supabase
        .from("companies")
        .select("id, company_name, country, city, owner_id")
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
  }, [supabase]);

  const filteredCompanies = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return companies;

    return companies.filter((company) => {
      const text = [
        company.company_name || "",
        company.city || "",
        company.country || "",
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(q);
    });
  }, [companies, search]);

  const selectedCompany =
    companies.find((company) => company.id === selectedCompanyId) || null;

  const handleClaim = async () => {
    setError("");
    setInfo("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Please log in first.");
      return;
    }

    if (!selectedCompanyId) {
      setError("Please select a company first.");
      return;
    }

    if (!selectedCompany) {
      setError("Selected company not found.");
      return;
    }

    if (selectedCompany.owner_id) {
      setError("This company already has an owner.");
      return;
    }

    setSubmitting(true);

    const fullMessage = [message.trim(), proof.trim()]
      .filter(Boolean)
      .join("\n\nProof / additional information:\n");

    const { error } = await supabase.from("claim_requests").insert([
      {
        company_id: selectedCompanyId,
        user_id: user.id,
        message: fullMessage || null,
        status: "pending",
      },
    ]);

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    setInfo("Claim request sent successfully.");
    setMessage("");
    setProof("");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href="/companies"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Claim your company
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Search for your company, select it, and send a short claim request.
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

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Search company
              </label>
              <input
                type="text"
                placeholder="Company name, city, country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Select company
              </label>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {loadingCompanies ? (
                  <div className="px-4 py-4 text-sm text-slate-500">
                    Loading companies...
                  </div>
                ) : filteredCompanies.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-slate-500">
                    No companies found.
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto">
                    {filteredCompanies.map((company) => {
                      const isSelected = selectedCompanyId === company.id;
                      const isOwned = !!company.owner_id;

                      return (
                        <button
                          key={company.id}
                          type="button"
                          onClick={() => setSelectedCompanyId(company.id)}
                          className={`flex w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 ${
                            isSelected
                              ? "bg-blue-50"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <div>
                            <div className="font-medium text-slate-900">
                              {company.company_name || "Unnamed company"}
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                              {company.city || "Unknown city"},{" "}
                              {company.country || "Unknown country"}
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isSelected ? (
                              <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-medium text-white">
                                Selected
                              </span>
                            ) : isOwned ? (
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
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                rows={4}
                placeholder="Why should this company profile belong to you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Proof
              </label>
              <textarea
                rows={4}
                placeholder="Company email, website access, public details, your role..."
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="button"
              onClick={handleClaim}
              disabled={submitting || !selectedCompanyId}
              className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending claim..." : "Send claim"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
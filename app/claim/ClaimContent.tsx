"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Company = {
  id: string;
  company_name: string | null;
  country: string | null;
  city: string | null;
  email: string | null;
  owner_id: string | null;
};

export default function ClaimContent() {
  const supabase = createClient();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [proof, setProof] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  // ✅ URL params (SAFE VERSION - NO useSearchParams)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preloadCompanyId = params.get("companyId") || "";
    const preloadName = params.get("name") || "";

    if (preloadCompanyId) setSelectedCompanyId(preloadCompanyId);
    if (preloadName) setSearch(preloadName);
  }, []);

  // ✅ Load companies
  useEffect(() => {
    const loadCompanies = async () => {
      setLoadingCompanies(true);

      const { data, error } = await supabase
        .from("companies")
        .select("id, company_name, country, city, email, owner_id")
        .order("company_name", { ascending: true });

      if (error) {
        console.error(error);
        setCompanies([]);
      } else {
        setCompanies((data as Company[]) || []);
      }

      setLoadingCompanies(false);
    };

    loadCompanies();
  }, [supabase]);

  // ✅ Filter
  const filteredCompanies = useMemo(() => {
    const q = search.toLowerCase();

    return companies.filter((c) =>
      `${c.company_name} ${c.city} ${c.country}`
        .toLowerCase()
        .includes(q)
    );
  }, [companies, search]);

  const handleClaim = async () => {
    setSubmitting(true);
    setError("");
    setInfo("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Please login first.");
      setSubmitting(false);
      return;
    }

    if (!selectedCompanyId) {
      setError("Select a company.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("claim_requests").insert([
      {
        company_id: selectedCompanyId,
        user_id: user.id,
        message: message + "\n\n" + proof,
        status: "pending",
      },
    ]);

    setSubmitting(false);

    if (error) {
      setError(error.message);
    } else {
      setInfo("Claim sent successfully.");
      setMessage("");
      setProof("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">

        <Link href="/companies" className="text-sm text-blue-600">
          ← Back
        </Link>

        <h1 className="text-2xl font-bold">
          Claim your company
        </h1>

        {info && <div className="text-green-600">{info}</div>}
        {error && <div className="text-red-600">{error}</div>}

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-3 rounded-xl"
        />

        {/* LIST */}
        <div className="border rounded-xl max-h-64 overflow-y-auto bg-white">
          {loadingCompanies ? (
            <p className="p-3">Loading...</p>
          ) : (
            filteredCompanies.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCompanyId(c.id)}
                className={`block w-full text-left p-3 border-b ${
                  selectedCompanyId === c.id ? "bg-blue-100" : ""
                }`}
              >
                <div className="font-semibold">
                  {c.company_name}
                </div>
                <div className="text-sm text-gray-500">
                  {c.city}, {c.country}
                </div>
              </button>
            ))
          )}
        </div>

        {/* MESSAGE */}
        <textarea
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-3 rounded-xl"
        />

        {/* PROOF */}
        <textarea
          placeholder="Proof..."
          value={proof}
          onChange={(e) => setProof(e.target.value)}
          className="w-full border p-3 rounded-xl"
        />

        <button
          onClick={handleClaim}
          disabled={submitting}
          className="w-full bg-blue-600 text-white p-3 rounded-xl"
        >
          {submitting ? "Sending..." : "Send claim"}
        </button>

      </div>
    </main>
  );
}
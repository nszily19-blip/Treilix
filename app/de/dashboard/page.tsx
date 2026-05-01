"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Claim = {
  id: string;
  company_name: string | null;
  company_id: string | null;
  user_id: string | null;
  full_name?: string | null;
  email: string | null;
  phone?: string | null;
  message?: string | null;
  status: string | null;
  created_at?: string | null;
};

type Submission = {
  id: string;
  slug?: string | null;
  logo_url: string | null;
  company_name: string | null;
  country: string | null;
  city: string | null;
  service_countries: string[] | null;
  transport_types: string[] | null;
  vehicle_types: string[] | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  user_id: string | null;
  status: string | null;
  created_at?: string | null;
};

type Company = {
  id: string;
  slug?: string | null;
  company_name: string | null;
  country: string | null;
  city: string | null;
  website?: string | null;
  owner_id?: string | null;
  created_at?: string | null;
  logo_url?: string | null;
};

type Inquiry = {
  id: string;
  created_at: string | null;
  company_id: string;
  company_owner_id: string | null;
  sender_user_id: string | null;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  message: string;
  status: string;
};

type InquiryWithCompany = Inquiry & {
  company_name?: string | null;
  company_logo_url?: string | null;
};

type UserInfo = {
  id: string;
  email?: string | null;
} | null;

type AdminTab = "claims" | "submissions" | "inquiries";
type UserRole = "admin" | "user";

function formatDate(value?: string | null) {
  if (!value) return "Unbekanntes Datum";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unbekanntes Datum";
  return date.toLocaleString("de-DE");
}

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name.trim().charAt(0).toUpperCase();
}

function normalizeWebsite(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

function CompanyLogo({
  logoUrl,
  companyName,
  size = "md",
}: {
  logoUrl?: string | null;
  companyName?: string | null;
  size?: "sm" | "md";
}) {
  const classes =
    size === "sm" ? "h-12 w-12 rounded-xl" : "h-14 w-14 rounded-2xl";

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={companyName || "Unternehmenslogo"}
        className={`${classes} border border-slate-200 bg-white object-cover`}
      />
    );
  }

  return (
    <div
      className={`${classes} flex items-center justify-center border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-500`}
    >
      {getInitials(companyName)}
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: number;
  subtext?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {subtext && <p className="mt-2 text-sm text-slate-500">{subtext}</p>}
    </div>
  );
}

function SectionCard({
  title,
  description,
  right,
  children,
}: {
  title: string;
  description?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

export default function DashboardPageDE() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [myCompanies, setMyCompanies] = useState<Company[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [user, setUser] = useState<UserInfo>(null);
  const [userRole, setUserRole] = useState<UserRole>("user");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [companySearch, setCompanySearch] = useState("");
  const [claimSearch, setClaimSearch] = useState("");
  const [submissionSearch, setSubmissionSearch] = useState("");
  const [inquirySearch, setInquirySearch] = useState("");

  const [claimStatusFilter, setClaimStatusFilter] = useState("all");
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState("all");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState("all");

  const [adminTab, setAdminTab] = useState<AdminTab>("claims");

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/de/login";
        return;
      }

      setUser({ id: user.id, email: user.email });

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      const isAdmin = profile?.role === "admin";
      setUserRole(isAdmin ? "admin" : "user");

      let claimsQuery = supabase
        .from("claim_requests")
        .select("*")
        .order("created_at", { ascending: false });

      let submissionsQuery = supabase
        .from("company_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      let inquiriesQuery = supabase
        .from("company_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      const myCompaniesQuery = supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      const allCompaniesQuery = supabase
        .from("companies")
        .select("id, company_name, city, country, owner_id, created_at, logo_url")
        .order("created_at", { ascending: false });

      if (!isAdmin) {
        claimsQuery = claimsQuery.eq("user_id", user.id);
        submissionsQuery = submissionsQuery.eq("user_id", user.id);
        inquiriesQuery = inquiriesQuery.eq("company_owner_id", user.id);
      }

      const [
        { data: claimsData },
        { data: submissionsData },
        { data: myCompaniesData },
        { data: allCompaniesData },
        { data: inquiriesData },
      ] = await Promise.all([
        claimsQuery,
        submissionsQuery,
        myCompaniesQuery,
        allCompaniesQuery,
        inquiriesQuery,
      ]);

      setClaims((claimsData as Claim[]) || []);
      setSubmissions((submissionsData as Submission[]) || []);
      setMyCompanies((myCompaniesData as Company[]) || []);
      setAllCompanies((allCompaniesData as Company[]) || []);
      setInquiries((inquiriesData as Inquiry[]) || []);
      setLoading(false);
    };

    load();
  }, []);

  const isAdmin = userRole === "admin";

  const companyMap = useMemo(() => {
    const map = new Map<string, Company>();
    allCompanies.forEach((company) => {
      map.set(company.id, company);
    });
    return map;
  }, [allCompanies]);

  const inquiriesWithCompany = useMemo<InquiryWithCompany[]>(() => {
    return inquiries.map((inquiry) => ({
      ...inquiry,
      company_name:
        companyMap.get(inquiry.company_id)?.company_name || "Unbekanntes Unternehmen",
      company_logo_url: companyMap.get(inquiry.company_id)?.logo_url || null,
    }));
  }, [inquiries, companyMap]);

  const updateClaimStatus = async (claim: Claim, status: string) => {
    const supabase = createClient();
    setActionLoading(`claim-${claim.id}-${status}`);

    const { error: claimError } = await supabase
      .from("claim_requests")
      .update({ status })
      .eq("id", claim.id);

    if (claimError) {
      alert(claimError.message);
      setActionLoading(null);
      return;
    }

    if (status === "approved" && claim.company_id && claim.user_id) {
      const { error: companyError } = await supabase
        .from("companies")
        .update({ owner_id: claim.user_id })
        .eq("id", claim.company_id);

      if (companyError) {
        alert(companyError.message);
        setActionLoading(null);
        return;
      }

      setAllCompanies((prev) =>
        prev.map((company) =>
          company.id === claim.company_id
            ? { ...company, owner_id: claim.user_id }
            : company
        )
      );
    }

    setClaims((prev) =>
      prev.map((item) => (item.id === claim.id ? { ...item, status } : item))
    );

    setActionLoading(null);
  };

  const updateSubmissionStatus = async (submission: Submission, status: string) => {
    const supabase = createClient();
    setActionLoading(`submission-${submission.id}-${status}`);

    const { error: submissionError } = await supabase
      .from("company_submissions")
      .update({ status })
      .eq("id", submission.id);

    if (submissionError) {
      alert(submissionError.message);
      setActionLoading(null);
      return;
    }

    if (status === "approved") {
      const { data: insertedCompany, error: insertError } = await supabase
        .from("companies")
        .insert([
          {
            company_name: submission.company_name,
            country: submission.country,
            city: submission.city,
            service_countries: submission.service_countries || [],
            transport_types: submission.transport_types || [],
            vehicle_types: submission.vehicle_types || [],
            email: submission.email,
            phone: submission.phone,
            website: submission.website,
            description: submission.description,
            logo_url: submission.logo_url,
            owner_id: submission.user_id,
            slug: submission.slug,
          },
        ])
        .select("*")
        .single();

      if (insertError) {
        alert(insertError.message);
        setActionLoading(null);
        return;
      }

      if (insertedCompany) {
        setAllCompanies((prev) => [insertedCompany as Company, ...prev]);
      }

      if (submission.user_id === user?.id && insertedCompany) {
        setMyCompanies((prev) => [insertedCompany as Company, ...prev]);
      }
    }

    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === submission.id ? { ...item, status } : item
      )
    );

    setActionLoading(null);
  };

  const updateInquiryStatus = async (inquiry: InquiryWithCompany, status: string) => {
    const supabase = createClient();
    setActionLoading(`inquiry-${inquiry.id}-${status}`);

    const { error } = await supabase
      .from("company_inquiries")
      .update({ status })
      .eq("id", inquiry.id);

    if (error) {
      alert(error.message);
      setActionLoading(null);
      return;
    }

    setInquiries((prev) =>
      prev.map((item) => (item.id === inquiry.id ? { ...item, status } : item))
    );

    setActionLoading(null);
  };

  const handleDeleteCompany = async (companyId: string) => {
    const supabase = createClient();

    const confirmDelete = window.confirm("Sind Sie sicher?");
    if (!confirmDelete) return;

    setActionLoading(`delete-company-${companyId}`);

    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", companyId);

    if (error) {
      alert(error.message);
      setActionLoading(null);
      return;
    }

    setMyCompanies((prev) => prev.filter((company) => company.id !== companyId));
    setAllCompanies((prev) => prev.filter((company) => company.id !== companyId));
    setActionLoading(null);
  };

  const filteredCompanies = useMemo(() => {
    return myCompanies.filter((company) => {
      const text =
        `${company.company_name || ""} ${company.city || ""} ${company.country || ""} ${company.website || ""}`.toLowerCase();
      return text.includes(companySearch.toLowerCase());
    });
  }, [myCompanies, companySearch]);

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesSearch =
        `${claim.company_name || ""} ${claim.email || ""} ${claim.full_name || ""} ${claim.phone || ""}`
          .toLowerCase()
          .includes(claimSearch.toLowerCase());
      const matchesStatus =
        claimStatusFilter === "all" ? true : (claim.status || "") === claimStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [claims, claimSearch, claimStatusFilter]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesSearch =
        `${submission.company_name || ""} ${submission.city || ""} ${submission.country || ""} ${submission.email || ""} ${submission.phone || ""}`
          .toLowerCase()
          .includes(submissionSearch.toLowerCase());
      const matchesStatus =
        submissionStatusFilter === "all"
          ? true
          : (submission.status || "") === submissionStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [submissions, submissionSearch, submissionStatusFilter]);

  const filteredInquiries = useMemo(() => {
    return inquiriesWithCompany.filter((inquiry) => {
      const matchesSearch =
        `${inquiry.company_name || ""} ${inquiry.sender_name || ""} ${inquiry.sender_email || ""} ${inquiry.sender_phone || ""} ${inquiry.message || ""}`
          .toLowerCase()
          .includes(inquirySearch.toLowerCase());
      const matchesStatus =
        inquiryStatusFilter === "all"
          ? true
          : (inquiry.status || "") === inquiryStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiriesWithCompany, inquirySearch, inquiryStatusFilter]);

  const pendingClaims = claims.filter((c) => c.status === "pending").length;
  const approvedClaims = claims.filter((c) => c.status === "approved").length;
  const rejectedClaims = claims.filter((c) => c.status === "rejected").length;

  const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;
  const approvedSubmissions = submissions.filter((s) => s.status === "approved").length;
  const rejectedSubmissions = submissions.filter((s) => s.status === "rejected").length;

  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const readInquiries = inquiries.filter((i) => i.status === "read").length;
  const closedInquiries = inquiries.filter((i) => i.status === "closed").length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {isAdmin
              ? "Admin-Übersicht"
              : "Verwalten Sie Ihre Unternehmen und Anfragen"}
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Laden...
          </div>
        )}

        {!loading && (
          <>
            {isAdmin ? (
              <>
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard label="Meine Unternehmen" value={myCompanies.length} />
                  <StatCard
                    label="Beanspruchungen"
                    value={claims.length}
                    subtext={`Ausstehend: ${pendingClaims} · Genehmigt: ${approvedClaims} · Abgelehnt: ${rejectedClaims}`}
                  />
                  <StatCard
                    label="Einreichungen"
                    value={submissions.length}
                    subtext={`Ausstehend: ${pendingSubmissions} · Genehmigt: ${approvedSubmissions} · Abgelehnt: ${rejectedSubmissions}`}
                  />
                  <StatCard
                    label="Anfragen"
                    value={inquiries.length}
                    subtext={`Neu: ${newInquiries} · Gelesen: ${readInquiries} · Geschlossen: ${closedInquiries}`}
                  />
                </section>

                <SectionCard
                  title="Meine Unternehmen"
                  description="Ihre Unternehmen auf Treilix."
                  right={
                    <Link
                      href="/de/add-company"
                      className="rounded-2xl bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Unternehmen eintragen
                    </Link>
                  }
                >
                  <div className="mb-5">
                    <input
                      type="text"
                      placeholder="Unternehmen, Stadt, Land suchen..."
                      value={companySearch}
                      onChange={(e) => setCompanySearch(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {filteredCompanies.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      Keine Unternehmen gefunden.
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {filteredCompanies.map((company) => (
                        <div
                          key={company.id}
                          className="rounded-2xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex items-start gap-3">
                            <CompanyLogo
                              logoUrl={company.logo_url}
                              companyName={company.company_name}
                            />

                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-lg font-semibold text-slate-900">
                                {company.company_name}
                              </h3>
                              <p className="mt-1 text-sm text-slate-500">
                                {company.city || "Unbekannte Stadt"},{" "}
                                {company.country || "Unbekanntes Land"}
                              </p>

                              {company.website && (
                                <a
                                  href={normalizeWebsite(company.website) || "#"}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-2 block truncate text-sm text-blue-600 hover:text-blue-700"
                                >
                                  {company.website}
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Link
                              href={`/de/companies/${company.slug || company.id}`}
                              className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                              Ansehen
                            </Link>

                            <Link
                              href={`/de/dashboard/edit-company/${company.id}`}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Bearbeiten
                            </Link>

                            <button
                              onClick={() => handleDeleteCompany(company.id)}
                              disabled={actionLoading === `delete-company-${company.id}`}
                              className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                            >
                              {actionLoading === `delete-company-${company.id}`
                                ? "Löschen..."
                                : "Löschen"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>

                <SectionCard
                  title="Admin-Werkzeuge"
                  description="Beanspruchungen, Einreichungen und Anfragen moderieren."
                >
                  <div className="mb-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => setAdminTab("claims")}
                      className={`rounded-2xl px-4 py-2 text-sm font-medium ${
                        adminTab === "claims"
                          ? "bg-blue-600 text-white"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Beanspruchungen {pendingClaims > 0 ? `(${pendingClaims})` : ""}
                    </button>

                    <button
                      onClick={() => setAdminTab("submissions")}
                      className={`rounded-2xl px-4 py-2 text-sm font-medium ${
                        adminTab === "submissions"
                          ? "bg-blue-600 text-white"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Einreichungen {pendingSubmissions > 0 ? `(${pendingSubmissions})` : ""}
                    </button>

                    <button
                      onClick={() => setAdminTab("inquiries")}
                      className={`rounded-2xl px-4 py-2 text-sm font-medium ${
                        adminTab === "inquiries"
                          ? "bg-blue-600 text-white"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Anfragen {newInquiries > 0 ? `(${newInquiries})` : ""}
                    </button>
                  </div>

                  {adminTab === "claims" && (
                    <>
                      <div className="mb-4 grid gap-3 md:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Unternehmen, E-Mail, Name, Telefon suchen..."
                          value={claimSearch}
                          onChange={(e) => setClaimSearch(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />

                        <select
                          value={claimStatusFilter}
                          onChange={(e) => setClaimStatusFilter(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="all">Alle Status</option>
                          <option value="pending">Ausstehend</option>
                          <option value="approved">Genehmigt</option>
                          <option value="rejected">Abgelehnt</option>
                        </select>
                      </div>

                      {filteredClaims.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                          Keine Beanspruchungen gefunden.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredClaims.map((claim) => (
                            <div
                              key={claim.id}
                              className="rounded-2xl border border-slate-200 p-4"
                            >
                              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-900">
                                    {claim.company_name}
                                  </h3>
                                  <p className="mt-1 text-sm text-slate-500">
                                    Angefordert: {formatDate(claim.created_at)}
                                  </p>
                                </div>

                                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                  {claim.status}
                                </span>
                              </div>

                              <div className="mt-4 space-y-1 text-sm text-slate-600">
                                {claim.full_name && (
                                  <p><strong>Name:</strong> {claim.full_name}</p>
                                )}
                                {claim.email && (
                                  <p><strong>E-Mail:</strong> {claim.email}</p>
                                )}
                                {claim.phone && (
                                  <p><strong>Telefon:</strong> {claim.phone}</p>
                                )}
                                {claim.message && (
                                  <p><strong>Nachricht:</strong> {claim.message}</p>
                                )}
                              </div>

                              {claim.status === "pending" && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <button
                                    onClick={() => updateClaimStatus(claim, "approved")}
                                    disabled={actionLoading === `claim-${claim.id}-approved`}
                                    className="rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                                  >
                                    {actionLoading === `claim-${claim.id}-approved`
                                      ? "Wird genehmigt..."
                                      : "Genehmigen"}
                                  </button>

                                  <button
                                    onClick={() => updateClaimStatus(claim, "rejected")}
                                    disabled={actionLoading === `claim-${claim.id}-rejected`}
                                    className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                                  >
                                    {actionLoading === `claim-${claim.id}-rejected`
                                      ? "Wird abgelehnt..."
                                      : "Ablehnen"}
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {adminTab === "submissions" && (
                    <>
                      <div className="mb-4 grid gap-3 md:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Unternehmen, Stadt, Land, E-Mail, Telefon suchen..."
                          value={submissionSearch}
                          onChange={(e) => setSubmissionSearch(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />

                        <select
                          value={submissionStatusFilter}
                          onChange={(e) => setSubmissionStatusFilter(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="all">Alle Status</option>
                          <option value="pending">Ausstehend</option>
                          <option value="approved">Genehmigt</option>
                          <option value="rejected">Abgelehnt</option>
                        </select>
                      </div>

                      {filteredSubmissions.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                          Keine Einreichungen gefunden.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredSubmissions.map((submission) => (
                            <div
                              key={submission.id}
                              className="rounded-2xl border border-slate-200 p-4"
                            >
                              <div className="flex items-start gap-3">
                                <CompanyLogo
                                  logoUrl={submission.logo_url}
                                  companyName={submission.company_name}
                                  size="sm"
                                />

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div>
                                      <h3 className="text-lg font-semibold text-slate-900">
                                        {submission.company_name}
                                      </h3>
                                      <p className="mt-1 text-sm text-slate-500">
                                        {submission.city || "Unbekannte Stadt"},{" "}
                                        {submission.country || "Unbekanntes Land"}
                                      </p>
                                      <p className="mt-1 text-sm text-slate-500">
                                        Eingereicht: {formatDate(submission.created_at)}
                                      </p>
                                    </div>

                                    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                      {submission.status}
                                    </span>
                                  </div>

                                  <div className="mt-4 space-y-1 text-sm text-slate-600">
                                    {submission.email && (
                                      <p><strong>E-Mail:</strong> {submission.email}</p>
                                    )}
                                    {submission.phone && (
                                      <p><strong>Telefon:</strong> {submission.phone}</p>
                                    )}
                                    {submission.website && (
                                      <p><strong>Website:</strong> {submission.website}</p>
                                    )}
                                  </div>

                                  {submission.status === "pending" && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                      <button
                                        onClick={() => updateSubmissionStatus(submission, "approved")}
                                        disabled={actionLoading === `submission-${submission.id}-approved`}
                                        className="rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                                      >
                                        {actionLoading === `submission-${submission.id}-approved`
                                          ? "Wird genehmigt..."
                                          : "Genehmigen"}
                                      </button>

                                      <button
                                        onClick={() => updateSubmissionStatus(submission, "rejected")}
                                        disabled={actionLoading === `submission-${submission.id}-rejected`}
                                        className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                                      >
                                        {actionLoading === `submission-${submission.id}-rejected`
                                          ? "Wird abgelehnt..."
                                          : "Ablehnen"}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {adminTab === "inquiries" && (
                    <>
                      <div className="mb-4 grid gap-3 md:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Unternehmen, Absender, E-Mail, Nachricht suchen..."
                          value={inquirySearch}
                          onChange={(e) => setInquirySearch(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />

                        <select
                          value={inquiryStatusFilter}
                          onChange={(e) => setInquiryStatusFilter(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="all">Alle Status</option>
                          <option value="new">Neu</option>
                          <option value="read">Gelesen</option>
                          <option value="closed">Geschlossen</option>
                        </select>
                      </div>

                      {filteredInquiries.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                          Keine Anfragen gefunden.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredInquiries.map((inquiry) => (
                            <div
                              key={inquiry.id}
                              className="rounded-2xl border border-slate-200 p-4"
                            >
                              <div className="flex items-start gap-3">
                                <CompanyLogo
                                  logoUrl={inquiry.company_logo_url}
                                  companyName={inquiry.company_name}
                                  size="sm"
                                />

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div>
                                      <h3 className="text-lg font-semibold text-slate-900">
                                        {inquiry.sender_name}
                                      </h3>
                                      <p className="mt-1 text-sm text-slate-500">
                                        Unternehmen: {inquiry.company_name}
                                      </p>
                                      <p className="mt-1 text-sm text-slate-500">
                                        {inquiry.sender_email}
                                      </p>
                                      {inquiry.sender_phone && (
                                        <p className="mt-1 text-sm text-slate-500">
                                          {inquiry.sender_phone}
                                        </p>
                                      )}
                                      <p className="mt-1 text-sm text-slate-500">
                                        {formatDate(inquiry.created_at)}
                                      </p>
                                    </div>

                                    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                      {inquiry.status}
                                    </span>
                                  </div>

                                  <p className="mt-4 whitespace-pre-line text-sm text-slate-700">
                                    {inquiry.message}
                                  </p>

                                  <div className="mt-4 flex flex-wrap gap-2">
                                    <Link
                                      href={`/de/companies/${companyMap.get(inquiry.company_id)?.slug || inquiry.company_id}`}
                                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                      Unternehmen öffnen
                                    </Link>

                                    {inquiry.status !== "read" && (
                                      <button
                                        onClick={() => updateInquiryStatus(inquiry, "read")}
                                        disabled={actionLoading === `inquiry-${inquiry.id}-read`}
                                        className="rounded-xl bg-slate-800 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                                      >
                                        {actionLoading === `inquiry-${inquiry.id}-read`
                                          ? "Wird gespeichert..."
                                          : "Als gelesen markieren"}
                                      </button>
                                    )}

                                    {inquiry.status !== "closed" && (
                                      <button
                                        onClick={() => updateInquiryStatus(inquiry, "closed")}
                                        disabled={actionLoading === `inquiry-${inquiry.id}-closed`}
                                        className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                                      >
                                        {actionLoading === `inquiry-${inquiry.id}-closed`
                                          ? "Wird geschlossen..."
                                          : "Als geschlossen markieren"}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </SectionCard>
              </>
            ) : (
              <>
                <section className="grid gap-4 sm:grid-cols-2">
                  <StatCard label="Meine Unternehmen" value={myCompanies.length} />
                  <StatCard
                    label="Meine Anfragen"
                    value={inquiries.length}
                    subtext={`Neu: ${newInquiries} · Gelesen: ${readInquiries} · Geschlossen: ${closedInquiries}`}
                  />
                </section>

                <div className="grid gap-6 xl:grid-cols-2">
                  <SectionCard
                    title="Meine Unternehmen"
                    description="Verwalten Sie Ihre Unternehmensprofile."
                    right={
                      <Link
                        href="/de/add-company"
                        className="rounded-2xl bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Unternehmen eintragen
                      </Link>
                    }
                  >
                    <div className="mb-5">
                      <input
                        type="text"
                        placeholder="Unternehmen, Stadt, Land suchen..."
                        value={companySearch}
                        onChange={(e) => setCompanySearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {filteredCompanies.length === 0 ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        Keine Unternehmen gefunden.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredCompanies.map((company) => (
                          <div
                            key={company.id}
                            className="rounded-2xl border border-slate-200 p-4"
                          >
                            <div className="flex items-start gap-3">
                              <CompanyLogo
                                logoUrl={company.logo_url}
                                companyName={company.company_name}
                              />

                              <div className="min-w-0 flex-1">
                                <h3 className="truncate text-lg font-semibold text-slate-900">
                                  {company.company_name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                  {company.city || "Unbekannte Stadt"},{" "}
                                  {company.country || "Unbekanntes Land"}
                                </p>

                                {company.website && (
                                  <a
                                    href={normalizeWebsite(company.website) || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 block truncate text-sm text-blue-600 hover:text-blue-700"
                                  >
                                    {company.website}
                                  </a>
                                )}
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <Link
                                href={`/de/companies/${company.slug || company.id}`}
                                className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                              >
                                Ansehen
                              </Link>

                              <Link
                                href={`/de/dashboard/edit-company/${company.id}`}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                              >
                                Bearbeiten
                              </Link>

                              <button
                                onClick={() => handleDeleteCompany(company.id)}
                                disabled={actionLoading === `delete-company-${company.id}`}
                                className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                              >
                                {actionLoading === `delete-company-${company.id}`
                                  ? "Löschen..."
                                  : "Löschen"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </SectionCard>

                  <SectionCard
                    title="Meine Anfragen"
                    description="Nachrichten an Ihre Unternehmen."
                  >
                    <div className="mb-4 grid gap-3">
                      <input
                        type="text"
                        placeholder="Anfrage suchen..."
                        value={inquirySearch}
                        onChange={(e) => setInquirySearch(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      />

                      <select
                        value={inquiryStatusFilter}
                        onChange={(e) => setInquiryStatusFilter(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="all">Alle Status</option>
                        <option value="new">Neu</option>
                        <option value="read">Gelesen</option>
                        <option value="closed">Geschlossen</option>
                      </select>
                    </div>

                    {filteredInquiries.length === 0 ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        Keine Anfragen gefunden.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredInquiries.map((inquiry) => (
                          <div
                            key={inquiry.id}
                            className="rounded-2xl border border-slate-200 p-4"
                          >
                            <div className="flex items-start gap-3">
                              <CompanyLogo
                                logoUrl={inquiry.company_logo_url}
                                companyName={inquiry.company_name}
                                size="sm"
                              />

                              <div className="min-w-0 flex-1">
                                <h3 className="text-lg font-semibold text-slate-900">
                                  {inquiry.sender_name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                  Unternehmen: {inquiry.company_name}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                  {inquiry.sender_email}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                  {formatDate(inquiry.created_at)}
                                </p>

                                <p className="mt-4 whitespace-pre-line text-sm text-slate-700">
                                  {inquiry.message}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                  <Link
                                    href={`/de/companies/${companyMap.get(inquiry.company_id)?.slug || inquiry.company_id}`}
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                  >
                                    Unternehmen öffnen
                                  </Link>

                                  {inquiry.status !== "read" && (
                                    <button
                                      onClick={() => updateInquiryStatus(inquiry, "read")}
                                      disabled={actionLoading === `inquiry-${inquiry.id}-read`}
                                      className="rounded-xl bg-slate-800 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                                    >
                                      {actionLoading === `inquiry-${inquiry.id}-read`
                                        ? "Wird gespeichert..."
                                        : "Als gelesen markieren"}
                                    </button>
                                  )}

                                  {inquiry.status !== "closed" && (
                                    <button
                                      onClick={() => updateInquiryStatus(inquiry, "closed")}
                                      disabled={actionLoading === `inquiry-${inquiry.id}-closed`}
                                      className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                                    >
                                      {actionLoading === `inquiry-${inquiry.id}-closed`
                                        ? "Wird geschlossen..."
                                        : "Als geschlossen markieren"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </SectionCard>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAIL = "nszily19@gmail.com";

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
  company_name: string | null;
  country: string | null;
  city: string | null;
  website?: string | null;
  owner_id?: string | null;
  created_at?: string | null;
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
};

type UserInfo = {
  id: string;
  email?: string | null;
} | null;

type AdminTab = "claims" | "submissions" | "inquiries";

function formatDate(value?: string | null) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

export default function DashboardPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [myCompanies, setMyCompanies] = useState<Company[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [user, setUser] = useState<UserInfo>(null);

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
        window.location.href = "/login";
        return;
      }

      setUser({
        id: user.id,
        email: user.email,
      });

      const isAdmin = user.email === ADMIN_EMAIL;

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
        .select("id, company_name, city, country, owner_id, created_at")
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

  const isAdmin = user?.email === ADMIN_EMAIL;

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
      company_name: companyMap.get(inquiry.company_id)?.company_name || "Unknown company",
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

  const updateSubmissionStatus = async (
    submission: Submission,
    status: string
  ) => {
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
  owner_id: submission.user_id,
}
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

  const updateInquiryStatus = async (
    inquiry: InquiryWithCompany,
    status: string
  ) => {
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

    const confirmDelete = window.confirm("Are you sure?");
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
        claimStatusFilter === "all"
          ? true
          : (claim.status || "") === claimStatusFilter;

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
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            {isAdmin ? "Admin overview" : "Your company activity overview"}
          </p>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">My companies</p>
                <p className="mt-2 text-3xl font-bold">{myCompanies.length}</p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  {isAdmin ? "Claims" : "My claims"}
                </p>
                <p className="mt-2 text-3xl font-bold">{claims.length}</p>
                {isAdmin && (
                  <p className="mt-2 text-sm text-slate-500">
                    Pending: {pendingClaims} · Approved: {approvedClaims} · Rejected: {rejectedClaims}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  {isAdmin ? "Submissions" : "My submissions"}
                </p>
                <p className="mt-2 text-3xl font-bold">{submissions.length}</p>
                {isAdmin && (
                  <p className="mt-2 text-sm text-slate-500">
                    Pending: {pendingSubmissions} · Approved: {approvedSubmissions} · Rejected: {rejectedSubmissions}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  {isAdmin ? "Inquiries" : "My inquiries"}
                </p>
                <p className="mt-2 text-3xl font-bold">{inquiries.length}</p>
                <p className="mt-2 text-sm text-slate-500">
                  New: {newInquiries} · Read: {readInquiries} · Closed: {closedInquiries}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-semibold">My Companies</h2>
                <Link
                  href="/add-company"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-center text-white"
                >
                  Add company
                </Link>
              </div>

              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Search company, city, country..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              {filteredCompanies.length === 0 ? (
                <div className="rounded-xl border bg-slate-50 p-4">
                  No owned companies found.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCompanies.map((company) => (
                    <div key={company.id} className="rounded-xl border bg-white p-4">
                      <h3 className="font-bold">{company.company_name}</h3>
                      <p className="text-sm text-slate-500">
                        {company.city || "Unknown city"}, {company.country || "Unknown country"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={`/companies/${company.id}`}
                          className="rounded bg-blue-600 px-3 py-1 text-white"
                        >
                          View
                        </Link>

                        <Link
                          href={`/dashboard/edit-company/${company.id}`}
                          className="rounded bg-slate-700 px-3 py-1 text-white"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDeleteCompany(company.id)}
                          disabled={actionLoading === `delete-company-${company.id}`}
                          className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-60"
                        >
                          {actionLoading === `delete-company-${company.id}`
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border bg-white p-5 shadow-sm">
              {isAdmin ? (
                <>
                  <div className="mb-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => setAdminTab("claims")}
                      className={`rounded-xl px-4 py-2 ${
                        adminTab === "claims"
                          ? "bg-blue-600 text-white"
                          : "border bg-white text-slate-700"
                      }`}
                    >
                      Claims {pendingClaims > 0 ? `(${pendingClaims} pending)` : ""}
                    </button>

                    <button
                      onClick={() => setAdminTab("submissions")}
                      className={`rounded-xl px-4 py-2 ${
                        adminTab === "submissions"
                          ? "bg-blue-600 text-white"
                          : "border bg-white text-slate-700"
                      }`}
                    >
                      Submissions {pendingSubmissions > 0 ? `(${pendingSubmissions} pending)` : ""}
                    </button>

                    <button
                      onClick={() => setAdminTab("inquiries")}
                      className={`rounded-xl px-4 py-2 ${
                        adminTab === "inquiries"
                          ? "bg-blue-600 text-white"
                          : "border bg-white text-slate-700"
                      }`}
                    >
                      Inquiries {newInquiries > 0 ? `(${newInquiries} new)` : ""}
                    </button>
                  </div>

                  {adminTab === "claims" && (
                    <>
                      <div className="mb-4">
                        <h2 className="text-2xl font-semibold">Claims</h2>
                      </div>

                      <div className="mb-4 grid gap-3 md:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Search company, email, name, phone..."
                          value={claimSearch}
                          onChange={(e) => setClaimSearch(e.target.value)}
                          className="rounded-xl border px-4 py-3"
                        />

                        <select
                          value={claimStatusFilter}
                          onChange={(e) => setClaimStatusFilter(e.target.value)}
                          className="rounded-xl border px-4 py-3"
                        >
                          <option value="all">All statuses</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      {filteredClaims.length === 0 ? (
                        <div className="rounded-xl border bg-slate-50 p-4">
                          No claims found.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredClaims.map((claim) => (
                            <div key={claim.id} className="rounded-xl border p-4">
                              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                <div>
                                  <h3 className="font-bold">{claim.company_name}</h3>
                                  <p className="text-sm text-slate-500">
                                    Requested: {formatDate(claim.created_at)}
                                  </p>
                                </div>

                                <div className="text-sm">
                                  <span className="rounded-full bg-slate-100 px-3 py-1">
                                    {claim.status}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-3 space-y-1 text-sm text-slate-600">
                                {claim.full_name && (
                                  <p><strong>Name:</strong> {claim.full_name}</p>
                                )}
                                {claim.email && (
                                  <p><strong>Email:</strong> {claim.email}</p>
                                )}
                                {claim.phone && (
                                  <p><strong>Phone:</strong> {claim.phone}</p>
                                )}
                                {claim.message && (
                                  <p><strong>Message:</strong> {claim.message}</p>
                                )}
                              </div>

                              {claim.status === "pending" && (
                                <div className="mt-4 flex gap-2">
                                  <button
                                    onClick={() => updateClaimStatus(claim, "approved")}
                                    disabled={actionLoading === `claim-${claim.id}-approved`}
                                    className="rounded bg-green-600 px-3 py-1 text-white disabled:opacity-60"
                                  >
                                    {actionLoading === `claim-${claim.id}-approved`
                                      ? "Approving..."
                                      : "Approve"}
                                  </button>

                                  <button
                                    onClick={() => updateClaimStatus(claim, "rejected")}
                                    disabled={actionLoading === `claim-${claim.id}-rejected`}
                                    className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-60"
                                  >
                                    {actionLoading === `claim-${claim.id}-rejected`
                                      ? "Rejecting..."
                                      : "Reject"}
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
                      <div className="mb-4">
                        <h2 className="text-2xl font-semibold">Company Submissions</h2>
                      </div>

                      <div className="mb-4 grid gap-3 md:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Search company, city, country, email, phone..."
                          value={submissionSearch}
                          onChange={(e) => setSubmissionSearch(e.target.value)}
                          className="rounded-xl border px-4 py-3"
                        />

                        <select
                          value={submissionStatusFilter}
                          onChange={(e) => setSubmissionStatusFilter(e.target.value)}
                          className="rounded-xl border px-4 py-3"
                        >
                          <option value="all">All statuses</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      {filteredSubmissions.length === 0 ? (
                        <div className="rounded-xl border bg-slate-50 p-4">
                          No submissions found.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredSubmissions.map((submission) => (
                            <div key={submission.id} className="rounded-xl border p-4">
                              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                <div>
                                  <h3 className="font-bold">{submission.company_name}</h3>
                                  <p className="text-sm text-slate-500">
                                    {submission.city || "Unknown city"}, {submission.country || "Unknown country"}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    Submitted: {formatDate(submission.created_at)}
                                  </p>
                                </div>

                                <div className="text-sm">
                                  <span className="rounded-full bg-slate-100 px-3 py-1">
                                    {submission.status}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-3 space-y-1 text-sm text-slate-600">
                                {submission.email && (
                                  <p><strong>Email:</strong> {submission.email}</p>
                                )}
                                {submission.phone && (
                                  <p><strong>Phone:</strong> {submission.phone}</p>
                                )}
                                {submission.website && (
                                  <p><strong>Website:</strong> {submission.website}</p>
                                )}
                              </div>

                              {submission.status === "pending" && (
                                <div className="mt-4 flex gap-2">
                                  <button
                                    onClick={() =>
                                      updateSubmissionStatus(submission, "approved")
                                    }
                                    disabled={actionLoading === `submission-${submission.id}-approved`}
                                    className="rounded bg-green-600 px-3 py-1 text-white disabled:opacity-60"
                                  >
                                    {actionLoading === `submission-${submission.id}-approved`
                                      ? "Approving..."
                                      : "Approve"}
                                  </button>

                                  <button
                                    onClick={() =>
                                      updateSubmissionStatus(submission, "rejected")
                                    }
                                    disabled={actionLoading === `submission-${submission.id}-rejected`}
                                    className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-60"
                                  >
                                    {actionLoading === `submission-${submission.id}-rejected`
                                      ? "Rejecting..."
                                      : "Reject"}
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {adminTab === "inquiries" && (
                    <>
                      <div className="mb-4">
                        <h2 className="text-2xl font-semibold">Inquiries</h2>
                      </div>

                      <div className="mb-4 grid gap-3 md:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Search company, sender, email, message..."
                          value={inquirySearch}
                          onChange={(e) => setInquirySearch(e.target.value)}
                          className="rounded-xl border px-4 py-3"
                        />

                        <select
                          value={inquiryStatusFilter}
                          onChange={(e) => setInquiryStatusFilter(e.target.value)}
                          className="rounded-xl border px-4 py-3"
                        >
                          <option value="all">All statuses</option>
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      {filteredInquiries.length === 0 ? (
                        <div className="rounded-xl border bg-slate-50 p-4">
                          No inquiries found.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredInquiries.map((inquiry) => (
                            <div key={inquiry.id} className="rounded-xl border p-4">
                              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                <div>
                                  <h3 className="font-bold">{inquiry.sender_name}</h3>
                                  <p className="text-sm text-slate-500">
                                    Company: {inquiry.company_name}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    {inquiry.sender_email}
                                  </p>
                                  {inquiry.sender_phone && (
                                    <p className="text-sm text-slate-500">
                                      {inquiry.sender_phone}
                                    </p>
                                  )}
                                  <p className="mt-1 text-sm text-slate-500">
                                    {formatDate(inquiry.created_at)}
                                  </p>
                                </div>

                                <div className="text-sm">
                                  <span className="rounded-full bg-slate-100 px-3 py-1">
                                    {inquiry.status}
                                  </span>
                                </div>
                              </div>

                              <p className="mt-4 whitespace-pre-line text-sm text-slate-700">
                                {inquiry.message}
                              </p>

                              <div className="mt-4 flex flex-wrap gap-2">
                                <Link
                                  href={`/companies/${inquiry.company_id}`}
                                  className="rounded border px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  Open company
                                </Link>

                                {inquiry.status !== "read" && (
                                  <button
                                    onClick={() => updateInquiryStatus(inquiry, "read")}
                                    disabled={actionLoading === `inquiry-${inquiry.id}-read`}
                                    className="rounded bg-slate-700 px-3 py-1 text-white disabled:opacity-60"
                                  >
                                    {actionLoading === `inquiry-${inquiry.id}-read`
                                      ? "Saving..."
                                      : "Mark as read"}
                                  </button>
                                )}

                                {inquiry.status !== "closed" && (
                                  <button
                                    onClick={() => updateInquiryStatus(inquiry, "closed")}
                                    disabled={actionLoading === `inquiry-${inquiry.id}-closed`}
                                    className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-60"
                                  >
                                    {actionLoading === `inquiry-${inquiry.id}-closed`
                                      ? "Closing..."
                                      : "Mark as closed"}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="grid gap-8 lg:grid-cols-3">
                  <section>
                    <div className="mb-4">
                      <h2 className="text-2xl font-semibold">My Claims</h2>
                    </div>

                    <div className="mb-4 grid gap-3">
                      <input
                        type="text"
                        placeholder="Search claim..."
                        value={claimSearch}
                        onChange={(e) => setClaimSearch(e.target.value)}
                        className="rounded-xl border px-4 py-3"
                      />

                      <select
                        value={claimStatusFilter}
                        onChange={(e) => setClaimStatusFilter(e.target.value)}
                        className="rounded-xl border px-4 py-3"
                      >
                        <option value="all">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    {filteredClaims.length === 0 ? (
                      <div className="rounded-xl border bg-slate-50 p-4">
                        No claims found.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredClaims.map((claim) => (
                          <div key={claim.id} className="rounded-xl border p-4">
                            <h3 className="font-bold">{claim.company_name}</h3>
                            <p className="text-sm text-slate-500">
                              Requested: {formatDate(claim.created_at)}
                            </p>
                            <p className="mt-2 text-sm">Status: {claim.status}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section>
                    <div className="mb-4">
                      <h2 className="text-2xl font-semibold">
                        My Company Submissions
                      </h2>
                    </div>

                    <div className="mb-4 grid gap-3">
                      <input
                        type="text"
                        placeholder="Search submission..."
                        value={submissionSearch}
                        onChange={(e) => setSubmissionSearch(e.target.value)}
                        className="rounded-xl border px-4 py-3"
                      />

                      <select
                        value={submissionStatusFilter}
                        onChange={(e) => setSubmissionStatusFilter(e.target.value)}
                        className="rounded-xl border px-4 py-3"
                      >
                        <option value="all">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    {filteredSubmissions.length === 0 ? (
                      <div className="rounded-xl border bg-slate-50 p-4">
                        No submissions found.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredSubmissions.map((submission) => (
                          <div key={submission.id} className="rounded-xl border p-4">
                            <h3 className="font-bold">{submission.company_name}</h3>
                            <p className="text-sm text-slate-500">
                              {submission.city || "Unknown city"}, {submission.country || "Unknown country"}
                            </p>
                            <p className="text-sm text-slate-500">
                              Submitted: {formatDate(submission.created_at)}
                            </p>
                            <p className="mt-2 text-sm">Status: {submission.status}</p>
                            {/* EMAIL / PHONE / WEBSITE */}
<div className="mt-3 space-y-1 text-sm text-slate-600">
  {submission.email && (
    <p><strong>Email:</strong> {submission.email}</p>
  )}
  {submission.phone && (
    <p><strong>Phone:</strong> {submission.phone}</p>
  )}
  {submission.website && (
    <p><strong>Website:</strong> {submission.website}</p>
  )}
</div>

{/* SERVICE COUNTRIES */}
{!!submission.service_countries?.length && (
  <div className="mt-3">
    <p className="mb-1 text-xs font-semibold text-slate-500">
      Service countries
    </p>
    <div className="flex flex-wrap gap-2">
      {submission.service_countries.map((item) => (
        <span
          key={item}
          className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
)}

{/* TRANSPORT TYPES */}
{!!submission.transport_types?.length && (
  <div className="mt-3">
    <p className="mb-1 text-xs font-semibold text-slate-500">
      Transport types
    </p>
    <div className="flex flex-wrap gap-2">
      {submission.transport_types.map((item) => (
        <span
          key={item}
          className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
)}

{/* VEHICLE TYPES */}
{!!submission.vehicle_types?.length && (
  <div className="mt-3">
    <p className="mb-1 text-xs font-semibold text-slate-500">
      Vehicle types
    </p>
    <div className="flex flex-wrap gap-2">
      {submission.vehicle_types.map((item) => (
        <span
          key={item}
          className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
)}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section>
                    <div className="mb-4">
                      <h2 className="text-2xl font-semibold">My Company Inquiries</h2>
                    </div>

                    <div className="mb-4 grid gap-3">
                      <input
                        type="text"
                        placeholder="Search inquiry..."
                        value={inquirySearch}
                        onChange={(e) => setInquirySearch(e.target.value)}
                        className="rounded-xl border px-4 py-3"
                      />

                      <select
                        value={inquiryStatusFilter}
                        onChange={(e) => setInquiryStatusFilter(e.target.value)}
                        className="rounded-xl border px-4 py-3"
                      >
                        <option value="all">All statuses</option>
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    {filteredInquiries.length === 0 ? (
                      <div className="rounded-xl border bg-slate-50 p-4">
                        No inquiries found.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredInquiries.map((inquiry) => (
                          <div key={inquiry.id} className="rounded-xl border p-4">
                            <h3 className="font-bold">{inquiry.sender_name}</h3>
                            <p className="text-sm text-slate-500">
                              Company: {inquiry.company_name}
                            </p>
                            <p className="text-sm text-slate-500">{inquiry.sender_email}</p>
                            <p className="text-sm text-slate-500">
                              {formatDate(inquiry.created_at)}
                            </p>
                            <p className="mt-3 whitespace-pre-line text-sm text-slate-700">
                              {inquiry.message}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <Link
                                href={`/companies/${inquiry.company_id}`}
                                className="rounded border px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                Open company
                              </Link>

                              {inquiry.status !== "read" && (
                                <button
                                  onClick={() => updateInquiryStatus(inquiry, "read")}
                                  disabled={actionLoading === `inquiry-${inquiry.id}-read`}
                                  className="rounded bg-slate-700 px-3 py-1 text-white disabled:opacity-60"
                                >
                                  {actionLoading === `inquiry-${inquiry.id}-read`
                                    ? "Saving..."
                                    : "Mark as read"}
                                </button>
                              )}

                              {inquiry.status !== "closed" && (
                                <button
                                  onClick={() => updateInquiryStatus(inquiry, "closed")}
                                  disabled={actionLoading === `inquiry-${inquiry.id}-closed`}
                                  className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-60"
                                >
                                  {actionLoading === `inquiry-${inquiry.id}-closed`
                                    ? "Closing..."
                                    : "Mark as closed"}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
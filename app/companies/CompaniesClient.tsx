"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

const COMPANIES_PER_PAGE = 20;

type Company = {
  id: string;
  slug?: string | null;
  logo_url?: string | null;
  company_name: string | null;
  country: string | null;
  city: string | null;
  website: string | null;
  service_countries: string[] | null;
  transport_types: string[] | null;
  vehicle_types: string[] | null;
  created_at?: string | null;
};

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

function toggleValue(
  value: string,
  list: string[],
  setList: React.Dispatch<React.SetStateAction<string[]>>
) {
  if (list.includes(value)) {
    setList(list.filter((item) => item !== value));
  } else {
    setList([...list, value]);
  }
}

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
        alt={companyName || "Company logo"}
        className="h-14 w-14 rounded-xl border border-slate-200 bg-white object-cover"
      />
    );
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-lg font-semibold text-slate-500">
      {getInitials(companyName)}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  variant = "default",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: "default" | "blue" | "green";
}) {
  const styles =
    variant === "blue"
      ? active
        ? "bg-blue-600 text-white"
        : "bg-blue-50 text-blue-700 hover:bg-blue-100"
      : variant === "green"
      ? active
        ? "bg-emerald-600 text-white"
        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      : active
        ? "bg-slate-900 text-white"
        : "bg-slate-100 text-slate-700 hover:bg-slate-200";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${styles}`}
    >
      {label}
    </button>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

export default function CompaniesClient() {
  const supabase = createClient();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [serviceFilters, setServiceFilters] = useState<string[]>([]);
  const [transportFilters, setTransportFilters] = useState<string[]>([]);
  const [vehicleFilters, setVehicleFilters] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const q = params.get("q") || "";
    const country = params.get("country") || "all";
    const service = params.get("service") || "";
    const transport = params.get("transport") || "";
    const vehicle = params.get("vehicle") || "";

    setSearch(q);
    setCountryFilter(country);
    setServiceFilters(service ? [service] : []);
    setTransportFilters(transport ? [transport] : []);
    setVehicleFilters(vehicle ? [vehicle] : []);
  }, []);

  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("companies")
        .select(
          "id, slug, company_name, country, city, website, logo_url, service_countries, transport_types, vehicle_types, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("LOAD COMPANIES ERROR:", error.message);
        setCompanies([]);
      } else {
        setCompanies((data as Company[]) || []);
      }

      setLoading(false);
    };

    loadCompanies();
  }, [supabase]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, countryFilter, serviceFilters, transportFilters, vehicleFilters]);

  const availableCountries = useMemo(
    () =>
      uniqueSorted(
        companies.map((c) => c.country).filter(Boolean) as string[]
      ),
    [companies]
  );

  const availableServiceCountries = useMemo(
    () => uniqueSorted(companies.flatMap((c) => c.service_countries || [])),
    [companies]
  );

  const availableTransportTypes = useMemo(
    () => uniqueSorted(companies.flatMap((c) => c.transport_types || [])),
    [companies]
  );

  const availableVehicleTypes = useMemo(
    () => uniqueSorted(companies.flatMap((c) => c.vehicle_types || [])),
    [companies]
  );

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const haystack = [
        company.company_name || "",
        company.country || "",
        company.city || "",
        company.website || "",
        ...(company.service_countries || []),
        ...(company.transport_types || []),
        ...(company.vehicle_types || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = haystack.includes(search.toLowerCase());

      const matchesCountry =
        countryFilter === "all" || company.country === countryFilter;

      const matchesService =
        serviceFilters.length === 0 ||
        serviceFilters.some((item) =>
          (company.service_countries || []).includes(item)
        );

      const matchesTransport =
        transportFilters.length === 0 ||
        transportFilters.some((item) =>
          (company.transport_types || []).includes(item)
        );

      const matchesVehicle =
        vehicleFilters.length === 0 ||
        vehicleFilters.some((item) =>
          (company.vehicle_types || []).includes(item)
        );

      return (
        matchesSearch &&
        matchesCountry &&
        matchesService &&
        matchesTransport &&
        matchesVehicle
      );
    });
  }, [
    companies,
    search,
    countryFilter,
    serviceFilters,
    transportFilters,
    vehicleFilters,
  ]);

  const totalPages = Math.ceil(filteredCompanies.length / COMPANIES_PER_PAGE);
  const startIndex = (currentPage - 1) * COMPANIES_PER_PAGE;
  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + COMPANIES_PER_PAGE
  );

  const resetFilters = () => {
    setSearch("");
    setCountryFilter("all");
    setServiceFilters([]);
    setTransportFilters([]);
    setVehicleFilters([]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const FiltersContent = (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-800">
          Search
        </label>
        <input
          type="text"
          placeholder="Company, city, country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-800">
          Company country
        </label>
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">All countries</option>
          {availableCountries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {!!availableServiceCountries.length && (
        <div>
          <p className="mb-3 text-sm font-medium text-slate-800">
            Service countries
          </p>
          <div className="flex flex-wrap gap-2">
            {availableServiceCountries.map((item) => (
              <FilterChip
                key={item}
                label={item}
                active={serviceFilters.includes(item)}
                onClick={() =>
                  toggleValue(item, serviceFilters, setServiceFilters)
                }
              />
            ))}
          </div>
        </div>
      )}

      {!!availableTransportTypes.length && (
        <div>
          <p className="mb-3 text-sm font-medium text-slate-800">
            Transport types
          </p>
          <div className="flex flex-wrap gap-2">
            {availableTransportTypes.map((item) => (
              <FilterChip
                key={item}
                label={item}
                active={transportFilters.includes(item)}
                onClick={() =>
                  toggleValue(item, transportFilters, setTransportFilters)
                }
                variant="blue"
              />
            ))}
          </div>
        </div>
      )}

      {!!availableVehicleTypes.length && (
        <div>
          <p className="mb-3 text-sm font-medium text-slate-800">
            Vehicle types
          </p>
          <div className="flex flex-wrap gap-2">
            {availableVehicleTypes.map((item) => (
              <FilterChip
                key={item}
                label={item}
                active={vehicleFilters.includes(item)}
                onClick={() =>
                  toggleValue(item, vehicleFilters, setVehicleFilters)
                }
                variant="green"
              />
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={resetFilters}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
      >
        Reset filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Companies
            </h1>
            <p className="mt-2 text-slate-600">
              Browse transport and logistics companies on Treilix.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 md:hidden"
          >
            {mobileFiltersOpen ? "Hide filters" : "Show filters"}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {FiltersContent}
            </div>
          </aside>

          {mobileFiltersOpen && (
            <div className="lg:hidden">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {FiltersContent}
              </div>
            </div>
          )}

          <section>
            <div className="mb-5 text-sm text-slate-500">
              {filteredCompanies.length > 0
                ? `Showing ${startIndex + 1}–${Math.min(startIndex + COMPANIES_PER_PAGE, filteredCompanies.length)} of ${filteredCompanies.length} companies`
                : `Showing 0 of ${companies.length} companies`}
            </div>

            {loading ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 animate-pulse rounded-xl bg-slate-200" />
                      <div className="min-w-0 flex-1">
                        <div className="h-5 w-2/3 animate-pulse rounded-lg bg-slate-200" />
                        <div className="mt-3 h-4 w-1/2 animate-pulse rounded-lg bg-slate-200" />
                        <div className="mt-3 h-4 w-1/3 animate-pulse rounded-lg bg-slate-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">
                  No companies found
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 xl:grid-cols-2">
                  {paginatedCompanies.map((company) => {
                    const websiteUrl = normalizeWebsite(company.website);
                    const companyPath = `/companies/${company.slug || company.id}`;

                    return (
                      <div
                        key={company.id}
                        className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          <CompanyLogo
                            logoUrl={company.logo_url}
                            companyName={company.company_name}
                          />

                          <div className="min-w-0 flex-1">
                            <Link
                              href={companyPath}
                              className="block truncate text-lg font-semibold text-slate-900 transition-colors duration-150 hover:text-blue-600"
                            >
                              {company.company_name}
                            </Link>

                            <p className="mt-1 text-sm text-slate-500">
                              {company.city || company.country || "Europe"}
                              {company.country && company.city
                                ? `, ${company.country}`
                                : ""}
                            </p>

                            {websiteUrl && (
                              <a
                                href={websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-1.5 block truncate text-sm text-blue-600 transition-colors duration-150 hover:text-blue-700"
                              >
                                {company.website}
                              </a>
                            )}

                            <div className="mt-4 flex flex-wrap gap-2">
                              <Link
                                href={companyPath}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-700"
                              >
                                View details
                              </Link>

                              <Link
                                href={`${companyPath}/contact`}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
                              >
                                Contact
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Company = {
  id: string;
  company_name: string | null;
  country: string | null;
  city: string | null;
  description: string | null;
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

function normalizeWebsite(url: string | null) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
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

export default function CompaniesPage() {
  const supabase = createClient();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [serviceFilters, setServiceFilters] = useState<string[]>([]);
  const [transportFilters, setTransportFilters] = useState<string[]>([]);
  const [vehicleFilters, setVehicleFilters] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
          "id, company_name, country, city, description, website, service_countries, transport_types, vehicle_types, created_at"
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
        company.description || "",
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

  const resetFilters = () => {
    setSearch("");
    setCountryFilter("all");
    setServiceFilters([]);
    setTransportFilters([]);
    setVehicleFilters([]);
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
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-800">
          Company country
        </label>
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
              <button
                key={item}
                type="button"
                onClick={() => toggleValue(item, serviceFilters, setServiceFilters)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  serviceFilters.includes(item)
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
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
              <button
                key={item}
                type="button"
                onClick={() =>
                  toggleValue(item, transportFilters, setTransportFilters)
                }
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  transportFilters.includes(item)
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {item}
              </button>
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
              <button
                key={item}
                type="button"
                onClick={() => toggleValue(item, vehicleFilters, setVehicleFilters)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  vehicleFilters.includes(item)
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={resetFilters}
        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Reset filters
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Companies
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Search transport and logistics companies by country, service area,
              transport type, and vehicle type.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 md:hidden"
          >
            {mobileFiltersOpen ? "Hide filters" : "Show filters"}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              {FiltersContent}
            </div>
          </aside>

          {mobileFiltersOpen && (
            <div className="lg:hidden">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                {FiltersContent}
              </div>
            </div>
          )}

          <section>
            <div className="mb-5 text-sm text-slate-600">
              Showing {filteredCompanies.length} of {companies.length} companies
            </div>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                    <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">
                  No companies found
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredCompanies.map((company) => {
                  const websiteUrl = normalizeWebsite(company.website);

                  return (
                    <div
                      key={company.id}
                      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/companies/${company.id}`}
                            className="block text-lg font-semibold text-slate-900 hover:text-blue-700"
                          >
                            {company.company_name}
                          </Link>

                          <p className="mt-1 text-sm text-slate-500">
                            {company.city || "Unknown city"},{" "}
                            {company.country || "Unknown country"}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                        {company.description || "No description yet."}
                      </p>

                      {!!company.service_countries?.length && (
                        <div className="mt-4">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Service countries
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
                            Transport types
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
                            Vehicle types
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

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                          href={`/companies/${company.id}`}
                          className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          View details
                        </Link>

                        <Link
                          href={`/companies/${company.id}/contact`}
                          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Contact
                        </Link>

                        {websiteUrl && (
                          <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
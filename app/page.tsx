"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Company = {
  id: string;
  company_name: string;
  city: string | null;
  country: string | null;
  description: string | null;
};

const SERVICE_COUNTRIES = [
  "Germany",
  "Austria",
  "Hungary",
  "Romania",
  "Poland",
  "Czech Republic",
  "Slovakia",
  "Italy",
  "France",
  "Netherlands",
  "Belgium",
  "Spain",
];

const TRANSPORT_TYPES = [
  "General cargo",
  "Refrigerated",
  "Express",
  "Car transport",
  "Container",
  "Heavy transport",
  "Groupage",
  "Full truck load",
  "Partial load",
];

const VEHICLE_TYPES = [
  "Van",
  "Box truck",
  "Curtain sider",
  "Refrigerated truck",
  "Car transporter",
  "Container truck",
  "Flatbed",
];

export default function HomePage() {
  const router = useRouter();

  const [featuredCompanies, setFeaturedCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [serviceCountry, setServiceCountry] = useState("");
  const [transportType, setTransportType] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  useEffect(() => {
    const supabase = createClient();

    const loadFeaturedCompanies = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("companies")
        .select("id, company_name, city, country, description")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setFeaturedCompanies(data);
      } else {
        setFeaturedCompanies([]);
      }

      setLoading(false);
    };

    loadFeaturedCompanies();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) params.set("q", keyword.trim());
    if (companyCountry.trim()) params.set("country", companyCountry.trim());
    if (serviceCountry) params.set("service", serviceCountry);
    if (transportType) params.set("transport", transportType);
    if (vehicleType) params.set("vehicle", vehicleType);

    router.push(`/companies?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              European transport directory
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
              Find transport companies across Europe
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Treilix helps businesses discover transport and logistics
              companies, filter by service area and transport type, and send
              direct inquiries through one clean platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/companies"
                className="rounded-2xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
              >
                Browse companies
              </Link>

              <Link
                href="/add-company"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
              >
                Add your company
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200">
                Claim company profiles
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200">
                Direct inquiries
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200">
                Better discovery
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Search transport companies
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Start with a keyword or filter by service area, transport type,
                and vehicle type.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Keyword, company, city..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Company country"
                  value={companyCountry}
                  onChange={(e) => setCompanyCountry(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <select
                  value={serviceCountry}
                  onChange={(e) => setServiceCountry(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Service country</option>
                  {SERVICE_COUNTRIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={transportType}
                  onChange={(e) => setTransportType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Transport type</option>
                  {TRANSPORT_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Vehicle type</option>
                  {VEHICLE_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Search companies
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-400">01</div>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Search smarter
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Filter transport companies by company country, service area,
              transport type and vehicle type.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-400">02</div>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Contact directly
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Send inquiries through Treilix and reach companies faster through
              one clear contact flow.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-400">03</div>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Manage your listing
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Company owners can claim profiles, update business details, and
              keep information accurate.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Recently added companies
              </h2>
              <p className="mt-2 text-slate-600">
                Explore the latest companies listed on Treilix.
              </p>
            </div>

            <Link
              href="/companies"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View all companies →
            </Link>
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
          ) : featuredCompanies.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                No companies yet
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Start by adding the first companies to the directory.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <Link href={`/companies/${company.id}`} className="block">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {company.company_name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {company.city || "Unknown city"},{" "}
                      {company.country || "Unknown country"}
                    </p>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {company.description || "No description yet."}
                    </p>
                  </Link>

                  <div className="mt-4 flex flex-wrap gap-2">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-8 md:px-6 md:py-14">
        <div className="mx-auto max-w-7xl rounded-3xl bg-slate-900 px-6 py-10 text-white shadow-sm md:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold">
                Add your company to Treilix
              </h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Join the directory, claim your profile, and start receiving
                direct inquiries through the platform.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/add-company"
                className="rounded-2xl bg-white px-5 py-3 text-center font-semibold text-slate-900 hover:bg-slate-100"
              >
                Add your company
              </Link>

              <Link
                href="/signup"
                className="rounded-2xl border border-slate-700 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
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
  "Germany", "Austria", "Hungary", "Poland", "Czech Republic", "Slovakia",
  "Slovenia", "Romania", "Bulgaria", "Italy", "France", "Spain",
  "Netherlands", "Belgium", "Denmark", "Sweden", "Norway", "Finland",
  "Switzerland", "United Kingdom",
];

const TRANSPORT_TYPES = [
  "General cargo", "Full truckload (FTL)", "Less than truckload (LTL)",
  "Express transport", "Refrigerated transport", "Hazardous goods (ADR)",
  "Heavy / oversized transport", "Car transport", "Container transport",
  "Furniture moving", "Milk transport", "Food transport",
  "Construction materials", "Waste transport",
];

const VEHICLE_TYPES = [
  "Van (3.5t)", "Box truck", "Curtain sider", "Refrigerated truck",
  "Flatbed truck", "Tanker", "Car transporter", "Container chassis",
  "Low loader", "Trailer / Semi-trailer", "Mega trailer", "Double trailer",
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
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-12 md:px-6 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-blue-50/40" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-0 h-64 w-64 rounded-full bg-slate-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              European transport directory
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Find transport companies across Europe
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Treilix helps businesses discover transport and logistics
              companies, filter by service area and transport type, and send
              direct inquiries through one clean platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/companies"
                className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white shadow-sm shadow-blue-200 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-300"
              >
                Browse companies
              </Link>

              <Link
                href="/add-company"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-center font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50"
              >
                Add your company
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                Claim company profiles
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                Direct inquiries
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                Better discovery
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Search transport companies
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Filter by service area, transport type, and more.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Keyword, company, city..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Company country"
                  value={companyCountry}
                  onChange={(e) => setCompanyCountry(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <select
                  value={serviceCountry}
                  onChange={(e) => setServiceCountry(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Service country</option>
                  {SERVICE_COUNTRIES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <select
                  value={transportType}
                  onChange={(e) => setTransportType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Transport type</option>
                  {TRANSPORT_TYPES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Vehicle type</option>
                  {VEHICLE_TYPES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
              >
                Search companies
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            {
              num: "01",
              title: "Search smarter",
              desc: "Filter transport companies by company country, service area, transport type and vehicle type.",
            },
            {
              num: "02",
              title: "Contact directly",
              desc: "Send inquiries through Treilix and reach companies faster through one clear contact flow.",
            },
            {
              num: "03",
              title: "Manage your listing",
              desc: "Company owners can claim profiles, update business details, and keep information accurate.",
            },
          ].map((card) => (
            <div
              key={card.num}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                {card.num}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recently added companies */}
      <section className="px-4 py-6 md:px-6 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                Recently added companies
              </h2>
              <p className="mt-1.5 text-slate-600">
                Explore the latest companies listed on Treilix.
              </p>
            </div>

            <Link
              href="/companies"
              className="text-sm font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700"
            >
              View all companies →
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="h-5 w-2/3 animate-pulse rounded-lg bg-slate-200" />
                  <div className="mt-3 h-4 w-1/2 animate-pulse rounded-lg bg-slate-200" />
                  <div className="mt-4 h-4 w-full animate-pulse rounded-lg bg-slate-200" />
                  <div className="mt-2 h-4 w-5/6 animate-pulse rounded-lg bg-slate-200" />
                </div>
              ))}
            </div>
          ) : featuredCompanies.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
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
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Link href={`/companies/${company.id}`} className="block">
                    <h3 className="text-base font-semibold text-slate-900 transition-colors duration-150 group-hover:text-blue-600">
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
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-700"
                    >
                      View details
                    </Link>

                    <Link
                      href={`/companies/${company.id}/contact`}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
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

      {/* CTA */}
      <section className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-10 shadow-lg shadow-blue-900/20 md:px-10">
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <div>
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  Add your company to Treilix
                </h2>
                <p className="mt-3 max-w-xl text-blue-100">
                  Join the directory, claim your profile, and start receiving
                  direct inquiries through the platform.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/add-company"
                  className="rounded-xl bg-white px-5 py-3 text-center font-semibold text-blue-600 transition-colors duration-200 hover:bg-blue-50"
                >
                  Add your company
                </Link>

                <Link
                  href="/signup"
                  className="rounded-xl border border-blue-400/40 px-5 py-3 text-center font-semibold text-white transition-colors duration-200 hover:bg-blue-500/30"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

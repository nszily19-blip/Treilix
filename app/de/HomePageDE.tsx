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
  { value: "General cargo", label: "Stückgut" },
  { value: "Full truckload (FTL)", label: "Komplettladung (FTL)" },
  { value: "Less than truckload (LTL)", label: "Teilladung (LTL)" },
  { value: "Express transport", label: "Expresstransport" },
  { value: "Refrigerated transport", label: "Kühltransport" },
  { value: "Hazardous goods (ADR)", label: "Gefahrgut (ADR)" },
  { value: "Heavy / oversized transport", label: "Schwer- / Sondertransport" },
  { value: "Car transport", label: "Autotransport" },
  { value: "Container transport", label: "Containertransport" },
  { value: "Furniture moving", label: "Möbeltransport" },
  { value: "Milk transport", label: "Milchtransport" },
  { value: "Food transport", label: "Lebensmitteltransport" },
  { value: "Construction materials", label: "Baustoffe" },
  { value: "Waste transport", label: "Abfalltransport" },
];

const VEHICLE_TYPES = [
  { value: "Van (3.5t)", label: "Transporter (3,5t)" },
  { value: "Box truck", label: "Koffer-LKW" },
  { value: "Curtain sider", label: "Planen-LKW" },
  { value: "Refrigerated truck", label: "Kühl-LKW" },
  { value: "Flatbed truck", label: "Pritschenfahrzeug" },
  { value: "Tanker", label: "Tankfahrzeug" },
  { value: "Car transporter", label: "Autotransporter" },
  { value: "Container chassis", label: "Container-Chassis" },
  { value: "Low loader", label: "Tieflader" },
  { value: "Trailer / Semi-trailer", label: "Anhänger / Sattelzug" },
  { value: "Mega trailer", label: "Mega-Trailer" },
  { value: "Double trailer", label: "Doppelstock-Trailer" },
];

export default function HomePageDE() {
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
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("companies")
        .select("id, company_name, city, country, description")
        .order("created_at", { ascending: false })
        .limit(6);
      setFeaturedCompanies(!error && data ? data : []);
      setLoading(false);
    };
    load();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (companyCountry.trim()) params.set("country", companyCountry.trim());
    if (serviceCountry) params.set("service", serviceCountry);
    if (transportType) params.set("transport", transportType);
    if (vehicleType) params.set("vehicle", vehicleType);
    router.push(`/de/companies?${params.toString()}`);
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
              Europäisches Transport-Verzeichnis
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Transportunternehmen in Europa finden
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Treilix hilft Unternehmen dabei, Transport- und Logistikunternehmen zu entdecken,
              nach Servicegebiet und Transportart zu filtern und direkte Anfragen über eine
              übersichtliche Plattform zu senden.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/de/companies"
                className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white shadow-sm shadow-blue-200 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-300"
              >
                Unternehmen durchsuchen
              </Link>

              <Link
                href="/de/add-company"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-center font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50"
              >
                Unternehmen eintragen
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                Unternehmensprofile beanspruchen
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                Direkte Anfragen
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                Bessere Auffindbarkeit
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Transportunternehmen suchen
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Nach Servicegebiet, Transportart und mehr filtern.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Stichwort, Unternehmen, Stadt..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Unternehmensland"
                  value={companyCountry}
                  onChange={(e) => setCompanyCountry(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <select
                  value={serviceCountry}
                  onChange={(e) => setServiceCountry(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Serviceland</option>
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
                  <option value="">Transportart</option>
                  {TRANSPORT_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>

                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Fahrzeugtyp</option>
                  {VEHICLE_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
              >
                Unternehmen suchen
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
              title: "Intelligenter suchen",
              desc: "Filtern Sie Transportunternehmen nach Unternehmensland, Servicegebiet, Transportart und Fahrzeugtyp.",
            },
            {
              num: "02",
              title: "Direkt Kontakt aufnehmen",
              desc: "Senden Sie Anfragen über Treilix und erreichen Sie Unternehmen schneller durch einen klaren Kontaktablauf.",
            },
            {
              num: "03",
              title: "Eintrag verwalten",
              desc: "Unternehmenseigentümer können Profile beanspruchen, Geschäftsdaten aktualisieren und Informationen aktuell halten.",
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
                Zuletzt hinzugefügte Unternehmen
              </h2>
              <p className="mt-1.5 text-slate-600">
                Entdecken Sie die neuesten auf Treilix gelisteten Unternehmen.
              </p>
            </div>

            <Link
              href="/de/companies"
              className="text-sm font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700"
            >
              Alle Unternehmen →
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
                Noch keine Unternehmen
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Fügen Sie die ersten Unternehmen zum Verzeichnis hinzu.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Link href={`/de/companies/${company.id}`} className="block">
                    <h3 className="text-base font-semibold text-slate-900 transition-colors duration-150 group-hover:text-blue-600">
                      {company.company_name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {company.city || "Unbekannte Stadt"},{" "}
                      {company.country || "Unbekanntes Land"}
                    </p>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {company.description || "Noch keine Beschreibung."}
                    </p>
                  </Link>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/de/companies/${company.id}`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-700"
                    >
                      Details ansehen
                    </Link>

                    <Link
                      href={`/de/companies/${company.id}/contact`}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
                    >
                      Kontakt
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
                  Ihr Unternehmen bei Treilix eintragen
                </h2>
                <p className="mt-3 max-w-xl text-blue-100">
                  Treten Sie dem Verzeichnis bei, beanspruchen Sie Ihr Profil und erhalten Sie
                  direkte Anfragen über die Plattform.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/de/add-company"
                  className="rounded-xl bg-white px-5 py-3 text-center font-semibold text-blue-600 transition-colors duration-200 hover:bg-blue-50"
                >
                  Unternehmen eintragen
                </Link>

                <Link
                  href="/de/signup"
                  className="rounded-xl border border-blue-400/40 px-5 py-3 text-center font-semibold text-white transition-colors duration-200 hover:bg-blue-500/30"
                >
                  Konto erstellen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              Europäisches Transport-Verzeichnis
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
              Transportunternehmen in Europa finden
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Treilix hilft Unternehmen dabei, Transport- und Logistikunternehmen zu entdecken, nach Servicegebiet und Transportart zu filtern und direkte Anfragen über eine übersichtliche Plattform zu senden.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/de/companies"
                className="rounded-2xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
              >
                Unternehmen durchsuchen
              </Link>

              <Link
                href="/add-company"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
              >
                Unternehmen eintragen
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200">
                Unternehmensprofile beanspruchen
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200">
                Direkte Anfragen
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200">
                Bessere Auffindbarkeit
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Transportunternehmen suchen
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Beginnen Sie mit einem Stichwort oder filtern Sie nach Servicegebiet, Transportart und Fahrzeugtyp.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Stichwort, Unternehmen, Stadt..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Unternehmensland"
                  value={companyCountry}
                  onChange={(e) => setCompanyCountry(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <select
                  value={serviceCountry}
                  onChange={(e) => setServiceCountry(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Serviceland</option>
                  {SERVICE_COUNTRIES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={transportType}
                  onChange={(e) => setTransportType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Transportart</option>
                  {TRANSPORT_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>

                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Fahrzeugtyp</option>
                  {VEHICLE_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Unternehmen suchen
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
              Intelligenter suchen
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Filtern Sie Transportunternehmen nach Unternehmensland, Servicegebiet, Transportart und Fahrzeugtyp.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-400">02</div>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Direkt Kontakt aufnehmen
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Senden Sie Anfragen über Treilix und erreichen Sie Unternehmen schneller durch einen klaren Kontaktablauf.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-400">03</div>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Eintrag verwalten
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Unternehmenseigentümer können Profile beanspruchen, Geschäftsdaten aktualisieren und Informationen aktuell halten.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Zuletzt hinzugefügte Unternehmen
              </h2>
              <p className="mt-2 text-slate-600">
                Entdecken Sie die neuesten auf Treilix gelisteten Unternehmen.
              </p>
            </div>

            <Link
              href="/de/companies"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Alle Unternehmen →
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
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
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <Link href={`/de/companies/${company.id}`} className="block">
                    <h3 className="text-lg font-semibold text-slate-900">
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
                      className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Details ansehen
                    </Link>

                    <Link
                      href={`/de/companies/${company.id}/contact`}
                      className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
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

      <section className="px-4 py-8 md:px-6 md:py-14">
        <div className="mx-auto max-w-7xl rounded-3xl bg-slate-900 px-6 py-10 text-white shadow-sm md:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold">
                Ihr Unternehmen bei Treilix eintragen
              </h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Treten Sie dem Verzeichnis bei, beanspruchen Sie Ihr Profil und erhalten Sie direkte Anfragen über die Plattform.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/add-company"
                className="rounded-2xl bg-white px-5 py-3 text-center font-semibold text-slate-900 hover:bg-slate-100"
              >
                Unternehmen eintragen
              </Link>

              <Link
                href="/signup"
                className="rounded-2xl border border-slate-700 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800"
              >
                Konto erstellen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

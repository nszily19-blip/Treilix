"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MultiSelect from "@/app/components/MultiSelect";

const SERVICE_COUNTRIES = [
  "Germany",
  "Austria",
  "Hungary",
  "Poland",
  "Czech Republic",
  "Slovakia",
  "Slovenia",
  "Romania",
  "Bulgaria",
  "Italy",
  "France",
  "Spain",
  "Netherlands",
  "Belgium",
  "Denmark",
  "Sweden",
  "Norway",
  "Finland",
  "Switzerland",
  "United Kingdom",
];

const TRANSPORT_TYPES = [
  "General cargo",
  "Full truckload (FTL)",
  "Less than truckload (LTL)",
  "Express transport",
  "Refrigerated transport",
  "Hazardous goods (ADR)",
  "Heavy / oversized transport",
  "Car transport",
  "Container transport",
  "Furniture moving",
  "Milk transport",
  "Food transport",
  "Construction materials",
  "Waste transport",
];

const VEHICLE_TYPES = [
  "Van (3.5t)",
  "Box truck",
  "Curtain sider",
  "Refrigerated truck",
  "Flatbed truck",
  "Tanker",
  "Car transporter",
  "Container chassis",
  "Low loader",
  "Trailer / Semi-trailer",
  "Mega trailer",
  "Double trailer",
];

type CompanyRecord = {
  id: string;
  owner_id?: string | null;
  company_name?: string | null;
  country?: string | null;
  city?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  description?: string | null;
  logo_url?: string | null;
  service_countries?: string[] | null;
  transport_types?: string[] | null;
  vehicle_types?: string[] | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function getInitials(name?: string | null) {
  if (!name) return "U";
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
        alt={companyName || "Unternehmenslogo"}
        className="h-20 w-20 rounded-3xl border border-slate-200 bg-white object-cover md:h-24 md:w-24"
      />
    );
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-2xl font-semibold text-slate-500 md:h-24 md:w-24">
      {getInitials(companyName)}
    </div>
  );
}

export default function EditCompanyPageDE() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const supabase = createClient();

  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [serviceCountries, setServiceCountries] = useState<string[]>([]);
  const [transportTypes, setTransportTypes] = useState<string[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const previewUrl = useMemo(() => {
    if (!logoFile) return null;
    return URL.createObjectURL(logoFile);
  }, [logoFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const loadCompany = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/de/login");
        return;
      }

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setMessage("Unternehmen konnte nicht geladen werden.");
        setLoading(false);
        return;
      }

      const company = data as CompanyRecord;

      if (company.owner_id && company.owner_id !== user.id) {
        setMessage("Sie sind nicht berechtigt, dieses Unternehmen zu bearbeiten.");
        setLoading(false);
        return;
      }

      setCompanyName(company.company_name || "");
      setCountry(company.country || "");
      setCity(company.city || "");
      setEmail(company.email || "");
      setPhone(company.phone || "");
      setWebsite(company.website || "");
      setDescription(company.description || "");
      setLogoUrl(company.logo_url || null);
      setServiceCountries(company.service_countries || []);
      setTransportTypes(company.transport_types || []);
      setVehicleTypes(company.vehicle_types || []);

      setLoading(false);
    };

    if (id) {
      loadCompany();
    }
  }, [id, router, supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    let finalLogoUrl = logoUrl;

    if (logoFile) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      const maxSize = 2 * 1024 * 1024;

      if (!allowedTypes.includes(logoFile.type)) {
        setMessage("Das Logo muss ein PNG-, JPG-, JPEG- oder WEBP-Bild sein.");
        setSaving(false);
        return;
      }

      if (logoFile.size > maxSize) {
        setMessage("Das Logo muss kleiner als 2 MB sein.");
        setSaving(false);
        return;
      }

      const fileExt = logoFile.name.split(".").pop()?.toLowerCase() || "png";
      const safeCompanyName = slugify(companyName || "company");
      const fileName = `${id}/${safeCompanyName}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(fileName, logoFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        setMessage("Logo-Upload-Fehler: " + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("company-logos")
        .getPublicUrl(fileName);

      finalLogoUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("companies")
      .update({
        company_name: companyName.trim(),
        country: country.trim(),
        city: city.trim(),
        email: email.trim(),
        phone: phone.trim(),
        website: website.trim(),
        description: description.trim(),
        logo_url: finalLogoUrl,
        service_countries: serviceCountries,
        transport_types: transportTypes,
        vehicle_types: vehicleTypes,
      })
      .eq("id", id);

    if (error) {
      setMessage("Fehler: " + error.message);
      setSaving(false);
      return;
    }

    setLogoUrl(finalLogoUrl);
    setLogoFile(null);
    setMessage("Unternehmen erfolgreich aktualisiert.");
    setSaving(false);

    setTimeout(() => {
      router.push("/de/dashboard");
    }, 700);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          Laden...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Unternehmen bearbeiten
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Aktualisieren Sie Ihr Unternehmensprofil und Logo.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <CompanyLogo
                logoUrl={previewUrl || logoUrl}
                companyName={companyName}
              />

              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Logo ändern
                </label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Erlaubt: PNG, JPG, JPEG, WEBP. Max. 2 MB.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Unternehmensname
              </label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Unternehmensname"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Land
                </label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Land"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Stadt
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Stadt"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <MultiSelect
              label="Serviceländer"
              options={SERVICE_COUNTRIES}
              selected={serviceCountries}
              setSelected={setServiceCountries}
            />

            <MultiSelect
              label="Transportarten"
              options={TRANSPORT_TYPES}
              selected={transportTypes}
              setSelected={setTransportTypes}
            />

            <MultiSelect
              label="Fahrzeugtypen"
              options={VEHICLE_TYPES}
              selected={vehicleTypes}
              setSelected={setVehicleTypes}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  E-Mail
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-Mail"
                  type="email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Telefon
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Telefon"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Website
              </label>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Website"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Beschreibung
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Erzählen Sie Besuchern von Ihrem Unternehmen, Ihren Dienstleistungen und Stärken..."
                rows={6}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Wird gespeichert..." : "Änderungen speichern"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/de/dashboard")}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Abbrechen
              </button>
            </div>

            {message && (
              <p className="text-sm text-slate-600">{message}</p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

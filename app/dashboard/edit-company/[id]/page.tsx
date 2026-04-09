"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MultiSelect from "@/app/components/MultiSelect";

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

export default function EditCompanyPage() {
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
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setMessage("Could not load company.");
        setLoading(false);
        return;
      }

      const company = data as CompanyRecord;

      if (company.owner_id && company.owner_id !== user.id) {
        setMessage("You are not allowed to edit this company.");
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
      const maxSize = 2 * 1024 * 1024; // 2 MB

      if (!allowedTypes.includes(logoFile.type)) {
        setMessage("Logo must be a PNG, JPG, JPEG or WEBP image.");
        setSaving(false);
        return;
      }

      if (logoFile.size > maxSize) {
        setMessage("Logo must be smaller than 2 MB.");
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
        setMessage("Logo upload error: " + uploadError.message);
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
      setMessage("Error: " + error.message);
      setSaving(false);
      return;
    }

    setLogoUrl(finalLogoUrl);
    setLogoFile(null);
    setMessage("Company updated successfully.");
    setSaving(false);

    setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Edit company
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Update your company profile information and logo.
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
                  Change company logo
                </label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Allowed: PNG, JPG, JPEG, WEBP. Max 2 MB.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Company name
              </label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Company country
                </label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Company country"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  City
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <MultiSelect
              label="Service countries"
              options={SERVICE_COUNTRIES}
              selected={serviceCountries}
              setSelected={setServiceCountries}
            />

            <MultiSelect
              label="Transport types"
              options={TRANSPORT_TYPES}
              selected={transportTypes}
              setSelected={setTransportTypes}
            />

            <MultiSelect
              label="Vehicle types"
              options={VEHICLE_TYPES}
              selected={vehicleTypes}
              setSelected={setVehicleTypes}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell visitors about your company, services and strengths..."
                rows={6}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
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
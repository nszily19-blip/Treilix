"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MultiSelect from "../components/MultiSelect";

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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function AddCompanyPage() {
  const supabase = createClient();

  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [serviceCountries, setServiceCountries] = useState<string[]>([]);
  const [transportTypes, setTransportTypes] = useState<string[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please log in first.");
      setLoading(false);
      return;
    }

    if (!companyName.trim()) {
      setMessage("Company name is required.");
      setLoading(false);
      return;
    }

    let logoUrl: string | null = null;

    if (logoFile) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      const maxSize = 2 * 1024 * 1024;

      if (!allowedTypes.includes(logoFile.type)) {
        setMessage("Logo must be a PNG, JPG, JPEG or WEBP image.");
        setLoading(false);
        return;
      }

      if (logoFile.size > maxSize) {
        setMessage("Logo must be smaller than 2 MB.");
        setLoading(false);
        return;
      }

      const fileExt = logoFile.name.split(".").pop()?.toLowerCase() || "png";
      const safeCompanyName = slugify(companyName || "company");
      const fileName = `${user.id}/${safeCompanyName}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(fileName, logoFile, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setMessage("Logo upload error: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("company-logos")
        .getPublicUrl(fileName);

      logoUrl = publicUrlData.publicUrl;
    }

    const baseSlug = slugify(`${companyName}-${country || "europe"}`);
    const slug = `${baseSlug}-${Date.now()}`;

    const { error } = await supabase.from("company_submissions").insert([
      {
        company_name: companyName.trim(),
        country: country.trim(),
        city: city.trim(),
        service_countries: serviceCountries,
        transport_types: transportTypes,
        vehicle_types: vehicleTypes,
        email: email.trim(),
        phone: phone.trim(),
        website: website.trim(),
        description: description.trim(),
        logo_url: logoUrl,
        slug,
        user_id: user.id,
        status: "pending",
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setMessage("Company submitted. Waiting for approval.");
    setCompanyName("");
    setCountry("");
    setCity("");
    setServiceCountries([]);
    setTransportTypes([]);
    setVehicleTypes([]);
    setEmail("");
    setPhone("");
    setWebsite("");
    setDescription("");
    setLogoFile(null);
  };

  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl space-y-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Add your company
          </h1>
          <p className="mt-2 text-slate-600">
            Submit your company to Treilix and make it easier for customers to find and contact you.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Company name
              </label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Company logo
              </label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className={inputClass}
              />
              <p className="mt-2 text-xs text-slate-500">
                Allowed: PNG, JPG, JPEG, WEBP. Max 2 MB.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
                <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className={inputClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={inputClass} />
              </div>
            </div>

            <MultiSelect label="Service countries" options={SERVICE_COUNTRIES} selected={serviceCountries} setSelected={setServiceCountries} />
            <MultiSelect label="Transport types" options={TRANSPORT_TYPES} selected={transportTypes} setSelected={setTransportTypes} />
            <MultiSelect label="Vehicle types" options={VEHICLE_TYPES} selected={vehicleTypes} setSelected={setVehicleTypes} />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Website</label>
              <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website" className={inputClass} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell visitors about your company, services and strengths..."
                rows={6}
                className={inputClass}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit company"}
            </button>

            {message && (
              <p className={`text-center text-sm ${message.toLowerCase().includes("error") ? "text-red-600" : "text-emerald-600"}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

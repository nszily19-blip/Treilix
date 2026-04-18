"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MultiSelect from "../components/MultiSelect";

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
        .upload(fileName, logoFile, {
          cacheControl: "3600",
          upsert: false,
        });

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

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Add your company
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Submit your company to Treilix and make it easier for customers to
            find and contact you.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Company name
              </label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Company logo
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

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Country
                </label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                />
              </div>
            </div>

            <div>
              <MultiSelect
                label="Service countries"
                options={SERVICE_COUNTRIES}
                selected={serviceCountries}
                setSelected={setServiceCountries}
              />
            </div>

            <div>
              <MultiSelect
                label="Transport types"
                options={TRANSPORT_TYPES}
                selected={transportTypes}
                setSelected={setTransportTypes}
              />
            </div>

            <div>
              <MultiSelect
                label="Vehicle types"
                options={VEHICLE_TYPES}
                selected={vehicleTypes}
                setSelected={setVehicleTypes}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
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

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit company"}
            </button>

            {message && (
              <p className="text-center text-sm text-slate-600">{message}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
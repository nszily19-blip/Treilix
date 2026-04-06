"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  const [serviceCountries, setServiceCountries] = useState<string[]>([]);
  const [transportTypes, setTransportTypes] = useState<string[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const loadCompany = async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        const company = data as any;

        setCompanyName(company.company_name || "");
        setCountry(company.country || "");
        setCity(company.city || "");
        setEmail(company.email || "");
        setPhone(company.phone || "");
        setWebsite(company.website || "");
        setDescription(company.description || "");
        setServiceCountries(company.service_countries || []);
        setTransportTypes(company.transport_types || []);
        setVehicleTypes(company.vehicle_types || []);
      }

      setLoading(false);
    };

    if (id) {
      loadCompany();
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();

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
        service_countries: serviceCountries,
        transport_types: transportTypes,
        vehicle_types: vehicleTypes,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Company updated successfully.");
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Edit company</h1>
        <p className="mt-2 text-sm text-slate-600">
          Update your company profile information.
        </p>

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company name"
            className="w-full rounded-xl border px-4 py-3"
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Company country"
              className="w-full rounded-xl border px-4 py-3"
              required
            />

            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="w-full rounded-xl border px-4 py-3"
              required
            />
          </div>

          <div className="rounded-2xl border p-4">
            <p className="mb-3 font-semibold text-slate-900">Service countries</p>
            <div className="grid gap-2 md:grid-cols-3">
              {SERVICE_COUNTRIES.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={serviceCountries.includes(item)}
                    onChange={() =>
                      toggleValue(item, serviceCountries, setServiceCountries)
                    }
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-4">
            <p className="mb-3 font-semibold text-slate-900">Transport types</p>
            <div className="grid gap-2 md:grid-cols-3">
              {TRANSPORT_TYPES.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={transportTypes.includes(item)}
                    onChange={() =>
                      toggleValue(item, transportTypes, setTransportTypes)
                    }
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-4">
            <p className="mb-3 font-semibold text-slate-900">Vehicle types</p>
            <div className="grid gap-2 md:grid-cols-3">
              {VEHICLE_TYPES.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={vehicleTypes.includes(item)}
                    onChange={() =>
                      toggleValue(item, vehicleTypes, setVehicleTypes)
                    }
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full rounded-xl border px-4 py-3"
              required
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Website"
            className="w-full rounded-xl border px-4 py-3"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={6}
            className="w-full rounded-xl border px-4 py-3"
          />

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </main>
  );
}
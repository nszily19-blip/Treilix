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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

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
        user_id: user?.id,
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
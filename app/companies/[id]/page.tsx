import type { Metadata } from "next";
import CompanyDetailClient from "./CompanyDetailClient";
import { createClient } from "@/lib/supabase/server";

type CompanySeoData = {
  company_name: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
 const supabase = await createClient();

  const { data } = await supabase
    .from("companies")
    .select("company_name, city, country, description")
    .eq("id", params.id)
    .single<CompanySeoData>();

  const companyName = data?.company_name || "Company";
  const country = data?.country || "Europe";
  const city = data?.city || "";
  const shortLocation = city ? `${city}, ${country}` : country;

  const title = `${companyName} – Transport company in ${country} | Treilix`;

  const description =
    data?.description?.trim() ||
    `${companyName} is a transport and logistics company based in ${shortLocation}. View company details and contact options on Treilix.`;

  const canonicalUrl = `https://www.treilix.com/companies/${params.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Treilix",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function CompanyDetailPage() {
  return <CompanyDetailClient />;
}
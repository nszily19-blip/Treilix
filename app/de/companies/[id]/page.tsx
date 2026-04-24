import type { Metadata } from "next";
import { cache } from "react";
import CompanyDetailClientDE from "./CompanyDetailClientDE";
import { createClient } from "@/lib/supabase/server";

type CompanySeoData = {
  company_name: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  website: string | null;
};

const getCompanySeoData = cache(
  async (id: string): Promise<CompanySeoData | null> => {
    const supabase = await createClient();

    let { data } = await supabase
      .from("companies")
      .select("company_name, city, country, description, website")
      .eq("slug", id)
      .maybeSingle<CompanySeoData>();

    if (!data) {
      const fallback = await supabase
        .from("companies")
        .select("company_name, city, country, description, website")
        .eq("id", id)
        .maybeSingle<CompanySeoData>();
      data = fallback.data;
    }

    return data;
  }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getCompanySeoData(id);

  const companyName = data?.company_name || "Unternehmen";
  const country = data?.country || "Europa";
  const city = data?.city || "";
  const shortLocation = city ? `${city}, ${country}` : country;

  const title = `${companyName} – Transportunternehmen in ${country} | Treilix`;
  const description =
    data?.description?.trim() ||
    `${companyName} ist ein Transport- und Logistikunternehmen mit Sitz in ${shortLocation}. Unternehmensdetails und Kontaktmöglichkeiten auf Treilix.`;

  const canonicalUrl = `https://www.treilix.com/de/companies/${id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `https://www.treilix.com/companies/${id}`,
        de: canonicalUrl,
      },
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

export default async function DeCompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getCompanySeoData(id);

  const jsonLd = data
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: data.company_name,
        description: data.description,
        ...(data.city || data.country
          ? {
              address: {
                "@type": "PostalAddress",
                ...(data.city ? { addressLocality: data.city } : {}),
                ...(data.country ? { addressCountry: data.country } : {}),
              },
            }
          : {}),
        ...(data.website ? { url: data.website } : {}),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <CompanyDetailClientDE />
    </>
  );
}

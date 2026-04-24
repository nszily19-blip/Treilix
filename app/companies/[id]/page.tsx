import { cache } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CompanyDetailClient from "./CompanyDetailClient";

type Company = {
  id: string;
  slug: string | null;
  company_name: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  transport_types: string[] | null;
  vehicle_types: string[] | null;
  service_countries: string[] | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  owner_id: string | null;
};

const getCompany = cache(async (id: string): Promise<Company | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("companies")
    .select(
      "id, slug, company_name, city, country, description, transport_types, vehicle_types, service_countries, phone, email, website, logo_url, owner_id"
    )
    .or(`slug.eq.${id},id.eq.${id}`)
    .single<Company>();
  return data ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const data = await getCompany(params.id);

  const companyName = data?.company_name || "Company";
  const country = data?.country || "Europe";
  const primaryTransport = data?.transport_types?.[0] || "Transport";

  const title = `${companyName} – ${primaryTransport} in ${country} | Treilix`;
  const description =
    data?.description?.trim() ||
    `${companyName} is a ${primaryTransport.toLowerCase()} company based in ${country}. View contact details and send inquiries on Treilix.`;

  const canonicalUrl = `https://www.treilix.com/companies/${data?.slug || params.id}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
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

export default async function CompanyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const company = await getCompany(params.id);

  const jsonLd = company
    ? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        ...(company.company_name && { name: company.company_name }),
        ...(company.description && { description: company.description }),
        url: `https://www.treilix.com/companies/${company.slug || params.id}`,
        ...(company.phone && { telephone: company.phone }),
        ...(company.email && { email: company.email }),
        ...(company.website && {
          sameAs: [
            company.website.startsWith("http")
              ? company.website
              : `https://${company.website}`,
          ],
        }),
        address: {
          "@type": "PostalAddress",
          ...(company.city && { addressLocality: company.city }),
          ...(company.country && { addressCountry: company.country }),
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CompanyDetailClient initialCompany={company} />
    </>
  );
}

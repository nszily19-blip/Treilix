import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  // lekérjük az összes céget
  const { data: companies } = await supabase
    .from("companies")
    .select("id, created_at");

  const companyUrls =
    companies?.map((company) => ({
      url: `https://www.treilix.com/companies/${company.id}`,
      lastModified: company.created_at
        ? new Date(company.created_at)
        : new Date(),
    })) ?? [];

  return [
    // főoldal
    {
      url: "https://www.treilix.com",
      lastModified: new Date(),
    },

    // companies lista
    {
      url: "https://www.treilix.com/companies",
      lastModified: new Date(),
    },

    // static oldalak
    {
      url: "https://www.treilix.com/privacy",
      lastModified: new Date(),
    },
    {
      url: "https://www.treilix.com/imprint",
      lastModified: new Date(),
    },

    // dinamikus cégek
    ...companyUrls,
  ];
}
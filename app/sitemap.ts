import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data: companies } = await supabase
    .from("companies")
    .select("id, slug, created_at");

  const companyUrls =
    companies?.map((company) => ({
      url: `https://www.treilix.com/companies/${company.slug || company.id}`,
      lastModified: company.created_at
        ? new Date(company.created_at)
        : new Date(),
    })) ?? [];

  return [
    {
      url: "https://www.treilix.com",
      lastModified: new Date(),
    },
    {
      url: "https://www.treilix.com/companies",
      lastModified: new Date(),
    },
    {
      url: "https://www.treilix.com/privacy",
      lastModified: new Date(),
    },
    {
      url: "https://www.treilix.com/imprint",
      lastModified: new Date(),
    },
    ...companyUrls,
  ];
}
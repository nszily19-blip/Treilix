import type { Metadata } from "next";
import CompanyDetailClient from "./CompanyDetailClient";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    alternates: {
      canonical: `https://www.treilix.com/companies/${params.id}`,
    },
  };
}

export default function CompanyDetailPage() {
  return <CompanyDetailClient />;
}
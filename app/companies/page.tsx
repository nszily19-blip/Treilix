import type { Metadata } from "next";
import CompaniesClient from "./CompaniesClient";

export const metadata: Metadata = {
  title: "Companies | Treilix",
  description: "Browse transport and logistics companies on Treilix.",
  alternates: {
    canonical: "https://www.treilix.com/companies",
    languages: {
      en: "https://www.treilix.com/companies",
      de: "https://www.treilix.com/de/companies",
    },
  },
};

export default function CompaniesPage() {
  return <CompaniesClient />;
}
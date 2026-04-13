import type { Metadata } from "next";
import CompaniesClient from "./CompaniesClient";

export const metadata: Metadata = {
  title: "Companies | Treilix",
  description: "Browse transport and logistics companies on Treilix.",
  alternates: {
    canonical: "https://www.treilix.com/companies",
  },
};

export default function CompaniesPage() {
  return <CompaniesClient />;
}
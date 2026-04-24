import type { Metadata } from "next";
import CompaniesClient from "./CompaniesClient";

export const metadata: Metadata = {
  title: "Transport Companies in Europe | Treilix",
  description:
    "Browse and search verified transport and logistics companies across Europe. Filter by country, transport type, vehicle type, and more.",
  alternates: {
    canonical: "https://www.treilix.com/companies",
  },
};

export default function CompaniesPage() {
  return <CompaniesClient />;
}

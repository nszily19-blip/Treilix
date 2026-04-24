import type { Metadata } from "next";
import CompaniesClientDE from "./CompaniesClientDE";

export const metadata: Metadata = {
  title: "Unternehmen | Treilix",
  description:
    "Durchsuchen Sie Transport- und Logistikunternehmen auf Treilix. Filtern Sie nach Land, Transportart und Fahrzeugtyp.",
  alternates: {
    canonical: "https://www.treilix.com/de/companies",
    languages: {
      en: "https://www.treilix.com/companies",
      de: "https://www.treilix.com/de/companies",
    },
  },
};

export default function DeCompaniesPage() {
  return <CompaniesClientDE />;
}

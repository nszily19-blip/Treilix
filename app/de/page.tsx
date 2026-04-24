import type { Metadata } from "next";
import HomePageDE from "./HomePageDE";

export const metadata: Metadata = {
  title: "Treilix – Europäisches Transport-Verzeichnis",
  description:
    "Finden Sie Transport- und Logistikunternehmen in ganz Europa. Treilix verbindet Unternehmen mit Transportdienstleistern über eine übersichtliche Plattform.",
  alternates: {
    canonical: "https://www.treilix.com/de",
    languages: {
      en: "https://www.treilix.com",
      de: "https://www.treilix.com/de",
    },
  },
};

export default function DeHomePage() {
  return <HomePageDE />;
}

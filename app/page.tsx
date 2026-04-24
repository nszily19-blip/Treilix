import type { Metadata } from "next";
import HomeClient from "./components/HomeClient";

export const metadata: Metadata = {
  title: "Treilix – Find Transport & Logistics Companies in Europe",
  description:
    "Search and connect with verified transport and logistics companies across Europe. Filter by country, transport type, and more.",
  alternates: {
    canonical: "https://www.treilix.com",
  },
};

export default function HomePage() {
  return <HomeClient />;
}

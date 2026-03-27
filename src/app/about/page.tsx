import { Metadata } from "next";
import AboutPageContent from "@/components/about/AboutPageContent";

export const metadata: Metadata = {
  title: "Танилцуулга - MyRoom",
  description: "MyRoom танилцуулга - Монголын хамгийн шилдэг өрөө захиалгын платформ",
};

export default function AboutPage() {
  return <AboutPageContent />;
}

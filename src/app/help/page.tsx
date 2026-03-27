import { Metadata } from "next";
import HelpPageContent from "@/components/help/HelpPageContent";

export const metadata: Metadata = {
  title: "Тусламж - MyRoom",
  description: "Түгээмэл асуулт хариулт, видео заавар болон холбогдох мэдээлэл",
};

export default function HelpPage() {
  return <HelpPageContent />;
}

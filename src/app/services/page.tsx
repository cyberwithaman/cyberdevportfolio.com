import Services from "@/app/components/Services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | AI-SecOps Research",
  description: "Explore the comprehensive AI-SecOps services offered, from CISO advisory to penetration testing and AI research.",
  keywords: "cybersecurity, CISO, penetration testing, ethical hacking, AI research, machine learning, data science, cyber defense, cyber warfare",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Services />
    </main>
  );
}

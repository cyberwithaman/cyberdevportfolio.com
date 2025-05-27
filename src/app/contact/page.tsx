import ContactSection from "@/app/components/ContactSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | AI-SecOps Research",
  description: "Contact us for more information about our AI-SecOps services and research.",
  keywords: "cybersecurity, AI-SecOps, security solutions, digital forensics",
};

export default function ContactPage() {
  return <ContactSection />;
}
import About from "@/app/components/About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | AI-SecOps Research",
  description: "Learn about our mission, team, and commitment to AI-SecOps.",
  keywords: "cybersecurity, AI-SecOps, security solutions, digital forensics",
};

export default function AboutPage() {
  return <About />;
}

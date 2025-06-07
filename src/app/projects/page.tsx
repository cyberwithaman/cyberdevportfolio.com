import Projects from "@/app/components/Project/Projects";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | AI-SecOps Research",
  description: "Explore our projects and research in AI-SecOps.",
  keywords: "cybersecurity, AI-SecOps, security solutions, digital forensics",
};

export default function ProjectsPage() {
  return <Projects />;
}
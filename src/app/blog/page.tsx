import Blog from "@/app/components/Blog/Blog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | AI-SecOps Research",
  description: "Explore our blog and stay updated on the latest AI-SecOps trends and insights.",
  keywords: "cybersecurity, AI-SecOps, security solutions, digital forensics",
};

export default function BlogPage() {
  return <Blog />;
} 
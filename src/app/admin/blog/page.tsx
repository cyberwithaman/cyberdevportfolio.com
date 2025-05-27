import BlogAdmin from "@/app/components/admin/BlogAdmin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | AI-SecOps Research Admin",
  description: "Manage your blog posts and categories.",
};

export default function AdminBlogPage() {
  return <BlogAdmin />;
} 
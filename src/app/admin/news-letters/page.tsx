import NewsletterAdmin from "@/app/components/admin/NewsletterAdmin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter Subscribers | AI-SecOps Research Admin",
  description: "Manage and view all newsletter subscribers",
};

export default function NewsletterPage() {
  return (
    <div>
      <NewsletterAdmin />
    </div>
  );
} 
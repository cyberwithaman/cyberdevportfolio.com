import ContactRequestsAdmin from "@/app/components/admin/ContactRequestsAdmin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Requests | AI-SecOps Research Admin",
  description: "Manage and view all contact requests from users",
};

export default function ContactRequestsPage() {
  return (
    <div>
      <ContactRequestsAdmin />
    </div>
  );
}

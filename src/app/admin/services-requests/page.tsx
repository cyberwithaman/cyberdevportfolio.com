import ServicesRequestsAdmin from "@/app/components/admin/ServicesRequestsAdmin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services Requests | AI-SecOps Research Admin",
  description: "Manage and view all services requests from users",
};

export default function ServicesRequestsPage() {
  return (
    <div>
      <ServicesRequestsAdmin />
    </div>
  );
}

import Dashboard from "@/app/components/admin/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | AI-SecOps Research Admin",
  description: "Manage and view all dashboard",
};

export default function DashboardPage() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}

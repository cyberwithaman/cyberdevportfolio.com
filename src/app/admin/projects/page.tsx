import ProjectsAdmin from "@/app/components/admin/ProjectsAdmin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | AI-SecOps Research Admin",
  description: "Manage and view all projects",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#0a192f]">
      <ProjectsAdmin />
    </div>
  );
}

import ProjectsRequestsAdmin from "@/app/components/admin/ProjectsRequestsAdmin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects Requests | AI-SecOps Research Admin",
  description: "Manage and view all projects requests from users",
};

export default function ProjectsRequestsPage() {
  return (
    <div>
      <ProjectsRequestsAdmin />
    </div>
  );
}
